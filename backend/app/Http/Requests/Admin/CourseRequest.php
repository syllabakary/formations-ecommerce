<?php
// app/Http/Controllers/Api/Admin/CourseRequest.php
// app/Http/Requests/Admin/CourseRequest.php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Ajoutez votre logique d'autorisation ici
    }

    public function rules(): array
    {
        $courseId = $this->route('course')?->id;

        return [
            'title' => 'required|string|max:255',
            'short_description' => 'required|string|max:500',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'type' => 'required|in:formation,certification,specialisation',
            'level' => 'required|in:debutant,intermediaire,avance',
            'difficulty' => 'required|in:facile,modere,difficile',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0|gt:price',
            'duration_hours' => 'required|integer|min:1|max:500',
            'skills' => 'nullable|array',
            'skills.*' => 'string|max:100',
            'category_id' => 'required|exists:categories,id',
            'trainer_id' => 'required|exists:trainers,id',
            'is_trending' => 'boolean',
            'is_bestseller' => 'boolean',
            'is_new' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le titre est requis.',
            'title.max' => 'Le titre ne peut pas dépasser 255 caractères.',
            'short_description.required' => 'La description courte est requise.',
            'short_description.max' => 'La description courte ne peut pas dépasser 500 caractères.',
            'description.required' => 'La description complète est requise.',
            'type.required' => 'Le type est requis.',
            'type.in' => 'Le type doit être : formation, certification ou spécialisation.',
            'level.required' => 'Le niveau est requis.',
            'level.in' => 'Le niveau doit être : débutant, intermédiaire ou avancé.',
            'difficulty.required' => 'La difficulté est requise.',
            'difficulty.in' => 'La difficulté doit être : facile, modéré ou difficile.',
            'price.required' => 'Le prix est requis.',
            'price.numeric' => 'Le prix doit être un nombre.',
            'price.min' => 'Le prix doit être supérieur ou égal à 0.',
            'original_price.numeric' => 'Le prix original doit être un nombre.',
            'original_price.gt' => 'Le prix original doit être supérieur au prix actuel.',
            'duration_hours.required' => 'La durée est requise.',
            'duration_hours.integer' => 'La durée doit être un nombre entier.',
            'duration_hours.min' => 'La durée doit être d\'au moins 1 heure.',
            'duration_hours.max' => 'La durée ne peut pas dépasser 500 heures.',
            'category_id.required' => 'La catégorie est requise.',
            'category_id.exists' => 'La catégorie sélectionnée n\'existe pas.',
            'trainer_id.required' => 'Le formateur est requis.',
            'trainer_id.exists' => 'Le formateur sélectionné n\'existe pas.',
            'skills.array' => 'Les compétences doivent être un tableau.',
            'skills.*.max' => 'Chaque compétence ne peut pas dépasser 100 caractères.',
            'image.image' => 'Le fichier doit être une image.',
            'image.mimes' => 'L\'image doit être au format jpeg, png, jpg ou gif.',
            'image.max' => 'L\'image ne peut pas dépasser 2MB.',
        ];
    }
}
