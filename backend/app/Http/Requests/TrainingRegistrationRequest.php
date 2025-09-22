<?php

// app/Http/Requests/TrainingRegistrationRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrainingRegistrationRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'training_id' => 'required|exists:trainings,id',
            'participant_name' => 'required|string|max:255',
            'participant_email' => 'required|email|max:255',
            'participant_phone' => 'required|string|max:20',
            'company' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000'
        ];
    }

    public function messages()
    {
        return [
            'training_id.required' => 'La formation est obligatoire.',
            'training_id.exists' => 'La formation sélectionnée n\'existe pas.',
            'participant_name.required' => 'Le nom est obligatoire.',
            'participant_email.required' => 'L\'email est obligatoire.',
            'participant_email.email' => 'L\'email doit être valide.',
            'participant_phone.required' => 'Le téléphone est obligatoire.',
        ];
    }
}