<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Trainer;
use Illuminate\Http\JsonResponse;

class TrainerController extends Controller
{
    public function index(): JsonResponse
    {
        $trainers = Trainer::active()
            ->withCount(['courses as courses_count' => function ($query) {
                $query->active();
            }])
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $trainers->map(function ($trainer) {
                return [
                    'id' => $trainer->id,
                    'name' => $trainer->name,
                    'email' => $trainer->email,
                    'phone' => $trainer->phone,
                    'bio' => $trainer->bio,
                    'avatar' => $trainer->avatar_url,
                    'specialties' => $trainer->specialties,
                    'rating' => $trainer->rating,
                    'total_reviews' => $trainer->total_reviews,
                    'courses_count' => $trainer->courses_count,
                ];
            })
        ]);
    }
}