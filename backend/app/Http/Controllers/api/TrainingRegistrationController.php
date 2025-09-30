<?php
// app/Http/Controllers/Api/RegistrationController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseEnrollmentRequest;
use App\Http\Requests\TrainingRegistrationRequest;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\InPersonTraining;
use App\Models\TrainingRegistration;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Exception;

class TrainingRegistrationController extends Controller
{
    /**
     * Register for a course (online) or training (in-person)
     */
    public function store(CourseEnrollmentRequest|TrainingRegistrationRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            
            $data = $request->validated();
            
            if (isset($data['course_id'])) {
                $result = $this->enrollInCourse($data);
            } else {
                $result = $this->registerForTraining($data);
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Inscription réussie ! Vous recevrez un email de confirmation.',
                'data' => $result
            ], 201);
            
        } catch (Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'inscription : ' . $e->getMessage()
            ], 422);
        }
    }

    /**
     * Enroll in an online course
     */
    protected function enrollInCourse(array $data): array
    {
        $course = Course::active()->findOrFail($data['course_id']);
        
        // Check if already enrolled
        $existingEnrollment = CourseEnrollment::where('course_id', $course->id)
            ->where('participant_email', $data['participant_email'])
            ->where('payment_status', '!=', 'failed')
            ->first();
            
        if ($existingEnrollment) {
            throw new Exception('Vous êtes déjà inscrit à cette formation.');
        }
        
        $enrollment = CourseEnrollment::create([
            'participant_name' => $data['participant_name'],
            'participant_email' => $data['participant_email'],
            'participant_phone' => $data['participant_phone'],
            'company' => $data['company'] ?? null,
            'notes' => $data['notes'] ?? null,
            'amount_paid' => $course->price,
            'payment_status' => 'pending',
            'enrolled_at' => now(),
            'course_id' => $course->id,
        ]);
        
        // TODO: Integrate with payment gateway
        // For now, mark as completed
        $enrollment->update(['payment_status' => 'completed']);
        
        // Update course stats
        $course->updateStats();
        
        return [
            'enrollment_id' => $enrollment->id,
            'course_title' => $course->title,
            'amount' => $enrollment->amount_paid,
        ];
    }

    /**
     * Register for an in-person training
     */
    protected function registerForTraining(array $data): array
    {
        $training = InPersonTraining::active()
            ->scheduled()
            ->findOrFail($data['training_id']);
            
        if ($training->is_full) {
            throw new Exception('Cette formation est complète.');
        }
        
        if (!$training->can_register) {
            throw new Exception('Les inscriptions pour cette formation sont fermées.');
        }
        
        // Check if already registered
        $existingRegistration = TrainingRegistration::where('in_person_training_id', $training->id)
            ->where('participant_email', $data['participant_email'])
            ->where('payment_status', '!=', 'failed')
            ->first();
            
        if ($existingRegistration) {
            throw new Exception('Vous êtes déjà inscrit à cette formation.');
        }
        
        $registration = TrainingRegistration::create([
            'participant_name' => $data['participant_name'],
            'participant_email' => $data['participant_email'],
            'participant_phone' => $data['participant_phone'],
            'company' => $data['company'] ?? null,
            'notes' => $data['notes'] ?? null,
            'amount_paid' => $training->price,
            'payment_status' => 'pending',
            'registered_at' => now(),
            'in_person_training_id' => $training->id,
        ]);
        
        // TODO: Integrate with payment gateway
        // For now, mark as completed and increment registered seats
        $registration->update(['payment_status' => 'completed']);
        $training->increment('registered_seats');
        
        // Update training stats
        $training->updateStats();
        
        return [
            'registration_id' => $registration->id,
            'training_title' => $training->title,
            'amount' => $registration->amount_paid,
            'available_seats' => $training->fresh()->available_seats,
        ];
    }

    /**
     * Get user registrations/enrollments
     */
    public function getUserRegistrations(string $email): JsonResponse
    {
        $enrollments = CourseEnrollment::with('course.category')
            ->where('participant_email', $email)
            ->where('payment_status', 'completed')
            ->get()
            ->map(function ($enrollment) {
                return [
                    'id' => $enrollment->id,
                    'type' => 'course',
                    'title' => $enrollment->course->title,
                    'category' => optional($enrollment->course->category)->name ?? '',
                    'enrolled_at' => $enrollment->enrolled_at->format('Y-m-d H:i:s'),
                    'progress' => $enrollment->progress_percentage,
                    'completed' => $enrollment->isCompleted(),
                    'certificate_issued' => $enrollment->certificate_issued,
                ];
            });

        $registrations = TrainingRegistration::with('inPersonTraining.category')
            ->where('participant_email', $email)
            ->where('payment_status', 'completed')
            ->get()
            ->map(function ($registration) {
                return [
                    'id' => $registration->id,
                    'type' => 'training',
                    'title' => $registration->inPersonTraining->title,
                    'category' => optional($registration->inPersonTraining->category)->name ?? '',
                    'registered_at' => $registration->registered_at->format('Y-m-d H:i:s'),
                    'attendance_status' => $registration->attendance_status,
                    'certificate_issued' => $registration->certificate_issued,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'enrollments' => $enrollments,
                'registrations' => $registrations,
            ]
        ]);
    }
}