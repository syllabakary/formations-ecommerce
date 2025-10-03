<?php
// app/Http/Requests/ReviewRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => 'required|in:course,training',
            'id' => 'required|integer',
            'reviewer_name' => 'required|string|max:255',
            'reviewer_email' => 'required|email|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Le type est requis.',
            'type.in' => 'Le type doit être "course" ou "training".',
            'id.required' => 'L\'identifiant est requis.',
            'id.integer' => 'L\'identifiant doit être un nombre.',
            'reviewer_name.required' => 'Votre nom est requis.',
            'reviewer_name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            'reviewer_email.required' => 'Votre email est requis.',
            'reviewer_email.email' => 'L\'email doit être valide.',
            'reviewer_email.max' => 'L\'email ne peut pas dépasser 255 caractères.',
            'rating.required' => 'La note est requise.',
            'rating.integer' => 'La note doit être un nombre.',
            'rating.min' => 'La note doit être au minimum 1.',
            'rating.max' => 'La note doit être au maximum 5.',
            'comment.max' => 'Le commentaire ne peut pas dépasser 1000 caractères.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $type = $this->input('type');
            $id = $this->input('id');
            
            if ($type && $id) {
                $modelClass = $type === 'course' 
                    ? \App\Models\Course::class 
                    : \App\Models\InPersonTraining::class;
                
                if (!$modelClass::find($id)) {
                    $validator->errors()->add('id', 'Cette formation n\'existe pas.');
                }
            }
        });
    }
}