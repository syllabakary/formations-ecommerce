<?php

// app/Http/Controllers/Api/TrainingRegistrationController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TrainingRegistration;
use App\Models\Training;
use App\Http\Requests\TrainingRegistrationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrainingRegistrationController extends Controller
{
    public function store(TrainingRegistrationRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $training = Training::findOrFail($request->training_id);
            
            // Vérifier les places disponibles
            if ($training->available_seats <= 0) {
                return response()->json([
                    'message' => 'Cette formation est complète.',
                    'error' => 'training_full'
                ], 422);
            }
            
            // Vérifier si l'email est déjà inscrit
            $existingRegistration = TrainingRegistration::where('training_id', $training->id)
                ->where('participant_email', $request->participant_email)
                ->first();
                
            if ($existingRegistration) {
                return response()->json([
                    'message' => 'Cet email est déjà inscrit à cette formation.',
                    'error' => 'email_already_registered'
                ], 422);
            }
            
            $registration = TrainingRegistration::create([
                'training_id' => $training->id,
                'participant_name' => $request->participant_name,
                'participant_email' => $request->participant_email,
                'participant_phone' => $request->participant_phone,
                'company' => $request->company,
                'notes' => $request->notes,
                'status' => 'confirmed',
                'amount_paid' => $training->price,
                'registered_at' => now()
            ]);
            
            // Clear cache
            Cache::forget("training_detail_{$training->id}");
            Cache::flush(); // Clear all training caches for simplicity
            
            return response()->json([
                'message' => 'Inscription réussie !',
                'registration' => $registration,
                'training' => $training->fresh()
            ], 201);
        });
    }
    
    public function checkAvailability($trainingId)
    {
        $training = Training::select('id', 'available_seats', 'max_seats', 'title')
            ->findOrFail($trainingId);
            
        return response()->json([
            'available_seats' => $training->available_seats,
            'max_seats' => $training->max_seats,
            'is_full' => $training->available_seats <= 0,
            'registered_count' => $training->max_seats - $training->available_seats
        ]);
    }
}
