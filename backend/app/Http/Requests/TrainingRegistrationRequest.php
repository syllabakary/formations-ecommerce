<?php
// app/Http/Requests/TrainingRegistrationRequest.php

namespace App\Http\Requests;

use App\Models\InPersonTraining;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TrainingRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'training_id' => [
                'required',
                'exists:in_person_trainings,id',
                Rule::exists('in_person_trainings', 'id')->where(function ($query) {
                    $query->where('is_active', true)
                          ->where('status', 'scheduled');
                })
            ],
            'participant_name' => 'required|string|max:255',
            'participant_email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('training_registrations', 'participant_email')
                    ->where('in_person_training_id', $this->input('training_id'))
                    ->where('payment_status', '!=', 'failed')
            ],
            'participant_phone' => 'required|string|max:20',
            'company' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'training_id.required' => 'La formation est requise.',
            'training_id.exists' => 'Cette formation n\'existe pas ou n\'est plus disponible.',
            'participant_name.required' => 'Le nom est requis.',
            'participant_name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            'participant_email.required' => 'L\'email est requis.',
            'participant_email.email' => 'L\'email doit être valide.',
            'participant_email.max' => 'L\'email ne peut pas dépasser 255 caractères.',
            'participant_email.unique' => 'Vous êtes déjà inscrit à cette formation.',
            'participant_phone.required' => 'Le téléphone est requis.',
            'participant_phone.max' => 'Le téléphone ne peut pas dépasser 20 caractères.',
            'company.max' => 'Le nom de l\'entreprise ne peut pas dépasser 255 caractères.',
            'notes.max' => 'Les notes ne peuvent pas dépasser 1000 caractères.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->input('training_id')) {
                $training = InPersonTraining::find($this->input('training_id'));
                
                if ($training && $training->is_full) {
                    $validator->errors()->add('training_id', 'Cette formation est complète.');
                }
                
                if ($training && !$training->can_register) {
                    $validator->errors()->add('training_id', 'Les inscriptions pour cette formation sont fermées.');
                }
            }
        });
    }
}
