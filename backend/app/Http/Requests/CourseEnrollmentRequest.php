<?php   

// app/Http/Requests/CourseEnrollmentRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseEnrollmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'course_id' => 'required|exists:courses,id',
            'participant_name' => 'required|string|max:255',
            'participant_email' => 'required|email|max:255',
            'participant_phone' => 'required|string|max:20',
            'company' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'course_id.required' => 'La formation est requise.',
            'course_id.exists' => 'Cette formation n\'existe pas.',
            'participant_name.required' => 'Le nom est requis.',
            'participant_name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            'participant_email.required' => 'L\'email est requis.',
            'participant_email.email' => 'L\'email doit être valide.',
            'participant_email.max' => 'L\'email ne peut pas dépasser 255 caractères.',
            'participant_phone.required' => 'Le téléphone est requis.',
            'participant_phone.max' => 'Le téléphone ne peut pas dépasser 20 caractères.',
            'company.max' => 'Le nom de l\'entreprise ne peut pas dépasser 255 caractères.',
            'notes.max' => 'Les notes ne peuvent pas dépasser 1000 caractères.',
        ];
    }
}

