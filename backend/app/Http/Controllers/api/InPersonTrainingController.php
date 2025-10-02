<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InPersonTraining;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class InPersonTrainingController extends Controller
{
    /**
     * Display a listing of active and scheduled in-person trainings.
     */
    public function index(Request $request)
    {
        $query = InPersonTraining::with(['category:id,name', 'trainer:id,name', 'city:id,name'])
            ->active()
            ->scheduled();

        // Optional filters
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        $trainings = $query->orderBy('start_date', 'asc')->get();

        $data = $trainings->map(function ($training) {
            return [
                'id' => $training->id,
                'title' => $training->title,
                'trainer' => $training->trainer_name ?: ($training->trainer ? $training->trainer->name : 'N/A'),
                'price' => $training->price,
                'type' => 'presentiel',
                'is_active' => $training->is_active,
                'start_date' => $training->start_date->format('Y-m-d'),
                'end_date' => $training->end_date->format('Y-m-d'),
                'venue_name' => $training->venue_name,
                'venue_address' => $training->venue_address,
                'max_seats' => $training->max_seats,
                'available_seats' => $training->available_seats,
                'status' => $training->status,
                'image_url' => $training->image_url,
                'formatted_price' => $training->formatted_price,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Store a newly created in-person training.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'short_description' => 'required|string|max:500',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'start_date' => 'required|date|after:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'venue_name' => 'required|string|max:255',
            'venue_address' => 'required|string',
            'max_seats' => 'required|integer|min:1',
            'category_id' => 'required|exists:categories,id',
            'city_id' => 'required|exists:cities,id',
            'trainer_name' => 'required|string|max:255',
            'registration_deadline' => 'nullable|date|before:start_date',
            'is_popular' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        $data['slug'] = Str::slug($data['title']);

        // Create trainer if not exists
        $trainer = \App\Models\Trainer::firstOrCreate(
            ['full_name' => $data['trainer_name']],
            ['is_active' => true]
        );
        $data['trainer_id'] = $trainer->id;

        $training = InPersonTraining::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Formation en présentiel créée avec succès',
            'data' => [
                'id' => $training->id,
                'title' => $training->title,
                'trainer' => $training->trainer_name,
                'price' => $training->price,
                'type' => 'presentiel',
                'is_active' => $training->is_active,
                'start_date' => $training->start_date->format('Y-m-d'),
            ]
        ], 201);
    }

    /**
     * Update the specified in-person training.
     */
    public function update(Request $request, $id)
    {
        $training = InPersonTraining::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'short_description' => 'sometimes|required|string|max:500',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'duration_days' => 'sometimes|required|integer|min:1',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'venue_name' => 'sometimes|required|string|max:255',
            'venue_address' => 'sometimes|required|string',
            'max_seats' => 'sometimes|required|integer|min:1',
            'category_id' => 'sometimes|required|exists:categories,id',
            'city_id' => 'sometimes|required|exists:cities,id',
            'trainer_name' => 'sometimes|required|string|max:255',
            'registration_deadline' => 'nullable|date',
            'is_popular' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();

        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        if (isset($data['trainer_name'])) {
            $trainer = \App\Models\Trainer::firstOrCreate(
                ['full_name' => $data['trainer_name']],
                ['is_active' => true]
            );
            $data['trainer_id'] = $trainer->id;
        }

        $training->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Formation mise à jour avec succès',
            'data' => [
                'id' => $training->id,
                'title' => $training->title,
                'trainer' => $training->trainer_name ?: ($training->trainer ? $training->trainer->name : 'N/A'),
                'price' => $training->price,
                'type' => 'presentiel',
                'is_active' => $training->is_active,
                'start_date' => $training->start_date->format('Y-m-d'),
            ]
        ]);
    }

    /**
     * Remove the specified in-person training.
     */
    public function destroy($id)
    {
        $training = InPersonTraining::findOrFail($id);

        // Check if there are registrations
        if ($training->registered_seats > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer une formation avec des inscriptions'
            ], 422);
        }

        $training->delete();

        return response()->json([
            'success' => true,
            'message' => 'Formation supprimée avec succès'
        ]);
    }

    /**
     * Toggle the active status of the training.
     */
    public function toggleStatus($id)
    {
        $training = InPersonTraining::findOrFail($id);

        $training->update(['is_active' => !$training->is_active]);

        return response()->json([
            'success' => true,
            'message' => $training->is_active ? 'Formation activée' : 'Formation désactivée',
            'data' => [
                'id' => $training->id,
                'title' => $training->title,
                'is_active' => $training->is_active,
            ]
        ]);
    }
}
