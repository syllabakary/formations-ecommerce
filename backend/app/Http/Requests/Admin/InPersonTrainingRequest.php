<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreInPersonTrainingRequest;
use App\Http\Requests\Admin\UpdateInPersonTrainingRequest;
use App\Models\Category;
use App\Models\City;
use App\Models\InPersonTraining;
use App\Models\Trainer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class InPersonTrainingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = InPersonTraining::query()
            ->with(['category', 'city', 'trainer'])
            ->orderBy('start_date', 'asc');

        // Filtres
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        if ($category = $request->get('category')) {
            $query->where('category_id', $category);
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $trainings = $query->paginate($request->get('per_page', 15));

        // Transform data
        $trainings->getCollection()->transform(function ($training) {
            return [
                'id' => $training->id,
                'title' => $training->title,
                'slug' => $training->slug,
                'short_description' => $training->short_description,
                'description' => $training->description,
            'category' => [
                'id' => optional($training->category)->id,
                'name' => optional($training->category)->name ?? '',
            ],
            'city' => [
                'id' => optional($training->city)->id,
                'name' => optional($training->city)->name ?? '',
            ],
            'trainer' => [
                'id' => optional($training->trainer)->id,
                'name' => optional($training->trainer)->name ?? '',
            ],
                'price' => $training->price,
                'original_price' => $training->original_price,
                'formatted_price' => number_format($training->price, 0, ',', ' ') . ' F CFA',
                'duration_days' => $training->duration_days,
                'start_date' => $training->start_date,
                'end_date' => $training->end_date,
                'start_time' => $training->start_time,
                'end_time' => $training->end_time,
                'venue_name' => $training->venue_name,
                'venue_address' => $training->venue_address,
                'max_seats' => $training->max_seats,
                'registered_seats' => $training->registered_seats,
                'available_seats' => $training->max_seats - $training->registered_seats,
                'rating' => $training->rating,
                'total_reviews' => $training->total_reviews,
                'is_popular' => $training->is_popular,
                'status' => $training->status,
                'is_active' => $training->is_active,
                'registration_deadline' => $training->registration_deadline,
                'image' => $training->image ? Storage::url($training->image) : null,
                'created_at' => $training->created_at->format('d/m/Y H:i'),
                'updated_at' => $training->updated_at->format('d/m/Y H:i'),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $trainings->items(),
            'meta' => [
                'current_page' => $trainings->currentPage(),
                'last_page' => $trainings->lastPage(),
                'per_page' => $trainings->perPage(),
                'total' => $trainings->total(),
            ]
        ]);
    }

    public function store(StoreInPersonTrainingRequest $request): JsonResponse
    {
        $data = $request->validated();
        
        // Handle image upload if provided
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('trainings', 'public');
        }

        // Generate slug if not provided
        if (!isset($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $training = InPersonTraining::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Formation créée avec succès',
            'data' => $this->transformTraining($training->load(['category', 'city', 'trainer']))
        ], 201);
    }

    public function update(UpdateInPersonTrainingRequest $request, InPersonTraining $training): JsonResponse
    {
        $data = $request->validated();

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            if ($training->image) {
                Storage::disk('public')->delete($training->image);
            }
            $data['image'] = $request->file('image')->store('trainings', 'public');
        }

        $training->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Formation mise à jour avec succès',
            'data' => $this->transformTraining($training->load(['category', 'city', 'trainer']))
        ]);
    }

    public function destroy(InPersonTraining $training): JsonResponse
    {
        if ($training->image) {
            Storage::disk('public')->delete($training->image);
        }

        $training->delete();

        return response()->json([
            'success' => true,
            'message' => 'Formation supprimée avec succès'
        ]);
    }

    public function formData(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'categories' => Category::where('is_active', true)->orderBy('name')->get(['id', 'name']),
                'cities' => City::where('is_active', true)->orderBy('name')->get(['id', 'name']),
                'trainers' => Trainer::where('is_active', true)->orderBy('first_name')->get()->map(function ($trainer) {
                    return [
                        'id' => $trainer->id,
                        'name' => $trainer->first_name . ' ' . $trainer->last_name,
                    ];
                }),
            ]
        ]);
    }

    private function transformTraining(InPersonTraining $training): array
    {
        return [
            'id' => $training->id,
            'title' => $training->title,
            'slug' => $training->slug,
            'short_description' => $training->short_description,
            'description' => $training->description,
            'category' => [
                'id' => optional($training->category)->id,
                'name' => optional($training->category)->name ?? '',
            ],
            'city' => [
                'id' => optional($training->city)->id,
                'name' => optional($training->city)->name ?? '',
            ],
            'trainer' => [
                'id' => optional($training->trainer)->id,
                'name' => optional($training->trainer)->name ?? '',
            ],
            'price' => $training->price,
            'original_price' => $training->original_price,
            'duration_days' => $training->duration_days,
            'start_date' => $training->start_date,
            'end_date' => $training->end_date,
            'start_time' => $training->start_time,
            'end_time' => $training->end_time,
            'venue_name' => $training->venue_name,
            'venue_address' => $training->venue_address,
            'max_seats' => $training->max_seats,
            'registered_seats' => $training->registered_seats,
            'rating' => $training->rating,
            'total_reviews' => $training->total_reviews,
            'is_popular' => $training->is_popular,
            'status' => $training->status,
            'is_active' => $training->is_active,
            'registration_deadline' => $training->registration_deadline,
            'image' => $training->image ? Storage::url($training->image) : null,
            'created_at' => $training->created_at,
            'updated_at' => $training->updated_at,
        ];
    }
}