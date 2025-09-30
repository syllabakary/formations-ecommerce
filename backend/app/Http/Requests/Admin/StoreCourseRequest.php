<?php
// app/Http/Requests/Admin/StoreCourseRequest.php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255|unique:courses,title',
            'slug' => 'nullable|string|max:255|unique:courses,slug',
            'short_description' => 'required|string|max:500',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'category_id' => 'required|exists:categories,id',
            
            // ✅ CORRIGÉ - trainer_id ET trainer_name optionnels
            'trainer_id' => 'nullable|exists:trainers,id',
            'trainer_name' => 'required_without:trainer_id|string|max:255',
            
            'type' => 'required|in:formation,certification,specialisation',
            'level' => 'required|in:debutant,intermediaire,avance',
            'difficulty' => 'required|in:facile,modere,difficile',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0|gt:price',
            'duration_hours' => 'required|integer|min:1',
            
            // ✅ AJOUTÉ - Validation pour les nouveaux champs
            'access_link' => 'nullable|url|max:500',
            'video_url' => 'nullable|url|max:500',
            
            'skills' => 'nullable',
            'is_trending' => 'boolean',
            'is_bestseller' => 'boolean',
            'is_new' => 'boolean',
            'is_active' => 'boolean',
            'published_at' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le titre est requis.',
            'title.unique' => 'Ce titre existe déjà.',
            'short_description.required' => 'La description courte est requise.',
            'description.required' => 'La description complète est requise.',
            'category_id.required' => 'La catégorie est requise.',
            'category_id.exists' => 'Cette catégorie n\'existe pas.',
            
            // ✅ Messages corrigés pour trainer
            'trainer_id.exists' => 'Ce formateur n\'existe pas.',
            'trainer_name.required_without' => 'Le nom du formateur est requis.',
            'trainer_name.string' => 'Le nom du formateur doit être du texte.',
            'trainer_name.max' => 'Le nom du formateur ne peut pas dépasser 255 caractères.',
            
            'type.required' => 'Le type est requis.',
            'level.required' => 'Le niveau est requis.',
            'difficulty.required' => 'La difficulté est requise.',
            'price.required' => 'Le prix est requis.',
            'duration_hours.required' => 'La durée est requise.',
            
            // ✅ Nouveaux messages
            'access_link.url' => 'Le lien d\'accès doit être une URL valide.',
            'video_url.url' => 'L\'URL de la vidéo doit être valide.',
        ];
    }

    protected function prepareForValidation()
    {
        // Convertir skills de JSON string vers array si nécessaire
        if ($this->skills && is_string($this->skills)) {
            try {
                $decoded = json_decode($this->skills, true);
                $this->merge(['skills' => $decoded ?? []]);
            } catch (\Exception $e) {
                $this->merge(['skills' => []]);
            }
        }

        // Convertir les booléens
        $this->merge([
            'is_trending' => filter_var($this->is_trending ?? false, FILTER_VALIDATE_BOOLEAN),
            'is_bestseller' => filter_var($this->is_bestseller ?? false, FILTER_VALIDATE_BOOLEAN),
            'is_new' => filter_var($this->is_new ?? false, FILTER_VALIDATE_BOOLEAN),
            'is_active' => filter_var($this->is_active ?? true, FILTER_VALIDATE_BOOLEAN),
        ]);
    }
}