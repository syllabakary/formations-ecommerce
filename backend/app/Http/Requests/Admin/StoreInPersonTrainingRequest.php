<?php
// app/Http/Requests/Admin/StoreInPersonTrainingRequest.php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;

class StoreInPersonTrainingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255|unique:in_person_trainings,title',
            'slug' => 'nullable|string|max:255|unique:in_person_trainings,slug',
            'short_description' => 'required|string|max:500',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category_id' => 'required|exists:categories,id',
            'city_name' => 'required|string|max:255',
            'trainer_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0|gt:price',
            'duration_days' => 'required|integer|min:1|max:30',
            'start_date' => 'required|date|after:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'venue_name' => 'nullable|string|max:255',
            'venue_address' => 'nullable|string|max:500',
            'max_seats' => 'required|integer|min:1|max:1000',
            'registration_deadline' => 'nullable|date|before_or_equal:start_date',
            'is_popular' => 'boolean',
            'status' => 'required|in:scheduled,ongoing,completed,cancelled',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le titre est requis.',
            'title.unique' => 'Ce titre existe déjà.',
            'title.max' => 'Le titre ne peut pas dépasser 255 caractères.',
            'slug.unique' => 'Ce slug existe déjà.',
            'short_description.required' => 'La description courte est requise.',
            'short_description.max' => 'La description courte ne peut pas dépasser 500 caractères.',
            'description.required' => 'La description complète est requise.',
            'image.image' => 'Le fichier doit être une image.',
            'image.mimes' => 'L\'image doit être au format: jpeg, png, jpg, gif.',
            'image.max' => 'L\'image ne peut pas dépasser 2MB.',
            'category_id.required' => 'La catégorie est requise.',
            'category_id.exists' => 'Cette catégorie n\'existe pas.',
            'city_id.required' => 'La ville est requise.',
            'city_id.exists' => 'Cette ville n\'existe pas.',
            'trainer_id.required' => 'Le formateur est requis.',
            'trainer_id.exists' => 'Ce formateur n\'existe pas.',
            'price.required' => 'Le prix est requis.',
            'price.numeric' => 'Le prix doit être un nombre.',
            'price.min' => 'Le prix doit être positif.',
            'original_price.numeric' => 'Le prix original doit être un nombre.',
            'original_price.min' => 'Le prix original doit être positif.',
            'original_price.gt' => 'Le prix original doit être supérieur au prix de vente.',
            'duration_days.required' => 'La durée est requise.',
            'duration_days.integer' => 'La durée doit être un nombre entier.',
            'duration_days.min' => 'La durée doit être d\'au moins 1 jour.',
            'duration_days.max' => 'La durée ne peut pas dépasser 30 jours.',
            'start_date.required' => 'La date de début est requise.',
            'start_date.date' => 'La date de début doit être une date valide.',
            'start_date.after' => 'La date de début doit être postérieure à aujourd\'hui.',
            'end_date.required' => 'La date de fin est requise.',
            'end_date.date' => 'La date de fin doit être une date valide.',
            'end_date.after_or_equal' => 'La date de fin doit être postérieure ou égale à la date de début.',
            'start_time.required' => 'L\'heure de début est requise.',
            'start_time.date_format' => 'L\'heure de début doit être au format HH:MM.',
            'end_time.required' => 'L\'heure de fin est requise.',
            'end_time.date_format' => 'L\'heure de fin doit être au format HH:MM.',
            'end_time.after' => 'L\'heure de fin doit être postérieure à l\'heure de début.',
            'venue_name.max' => 'Le nom du lieu ne peut pas dépasser 255 caractères.',
            'venue_address.max' => 'L\'adresse ne peut pas dépasser 500 caractères.',
            'max_seats.required' => 'Le nombre de places est requis.',
            'max_seats.integer' => 'Le nombre de places doit être un nombre entier.',
            'max_seats.min' => 'Il doit y avoir au moins 1 place.',
            'max_seats.max' => 'Le nombre de places ne peut pas dépasser 1000.',
            'registration_deadline.date' => 'La date limite d\'inscription doit être une date valide.',
            'registration_deadline.before_or_equal' => 'La date limite d\'inscription doit être antérieure ou égale à la date de début.',
            'status.required' => 'Le statut est requis.',
            'status.in' => 'Le statut doit être: programmé, en cours, terminé ou annulé.',
        ];
    }

    protected function prepareForValidation()
    {
        // Convert boolean strings to actual booleans
        $this->merge([
            'is_popular' => filter_var($this->is_popular, FILTER_VALIDATE_BOOLEAN),
            'is_active' => filter_var($this->is_active, FILTER_VALIDATE_BOOLEAN),
        ]);
    }
}