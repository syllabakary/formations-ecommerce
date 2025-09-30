<?php
// app/Http/Controllers/Api/TrainingController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\City;
use App\Models\Course;
use App\Models\InPersonTraining;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TrainingController extends Controller
{
    /**
     * Get unified training catalog (courses and in-person trainings)
     */
    public function index(Request $request): JsonResponse
    {
        $mode = $request->get('mode', 'online'); // 'online' or 'in-person'
        $search = $request->get('search');
        $categoryId = $request->get('category_id');
        $cityId = $request->get('city_id');
        $level = $request->get('level');
        $type = $request->get('type');
        $sortBy = $request->get('sort_by', 'popular');
        $sortOrder = $request->get('sort_order', 'desc');
        $perPage = $request->get('per_page', 12);

        if ($mode === 'online') {
            return $this->getOnlineCourses($request);
        } else {
            return $this->getInPersonTrainings($request);
        }
    }

    /**
     * Get online courses
     */
    protected function getOnlineCourses(Request $request): JsonResponse
    {
        $query = Course::query()
            ->with(['category', 'trainer'])
            ->active();

        // Filters
        if ($search = $request->get('search')) {
            $query->search($search);
        }

        if ($categoryId = $request->get('category_id')) {
            $query->byCategory($categoryId);
        }

        if ($level = $request->get('level')) {
            $query->byLevel($level);
        }

        if ($type = $request->get('type')) {
            $query->byType($type);
        }

        // Sorting
        switch ($request->get('sort_by', 'popular')) {
            case 'rating':
                $query->highestRated();
                break;
            case 'price-low':
                $query->priceAsc();
                break;
            case 'price-high':
                $query->priceDesc();
                break;
            case 'newest':
                $query->newest();
                break;
            case 'popular':
            default:
                $query->popular();
                break;
        }

        $courses = $query->paginate($request->get('per_page', 12));

        // Transform data
        $courses->getCollection()->transform(function ($course) {
            return [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'description' => $course->short_description,
                'image' => $course->image_url,
                'category' => optional($course->category)->name ?? '',
                'level' => ucfirst($course->level),
                'type' => ucfirst($course->type),
                'difficulty' => ucfirst($course->difficulty),
                'price' => $course->price,
                'original_price' => $course->original_price,
                'formatted_price' => $course->formatted_price,
                'formatted_original_price' => $course->formatted_original_price,
                'discount' => $course->discount_percentage,
                'duration' => $course->duration_formatted,
                'modules' => $course->modules_count,
                'skills' => $course->skills,
                'rating' => $course->rating,
                'reviews' => $course->total_reviews,
                'students' => $course->total_students,
                'instructor' => optional($course->trainer)->name ?? '',
                'trending' => $course->is_trending,
                'bestseller' => $course->is_bestseller,
                'new' => $course->is_new,
                'mode' => 'online',
                'available_seats' => $course->available_seats,
                'is_full' => $course->is_full,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $courses->items(),
            'meta' => [
                'current_page' => $courses->currentPage(),
                'last_page' => $courses->lastPage(),
                'per_page' => $courses->perPage(),
                'total' => $courses->total(),
            ]
        ]);
    }

    /**
     * Get in-person trainings
     */
    protected function getInPersonTrainings(Request $request): JsonResponse
    {
        $tab = $request->get('tab', 'upcoming'); // 'upcoming', 'past', 'all'
        
        $query = InPersonTraining::query()
            ->with(['category', 'city', 'trainer'])
            ->active()
            ->scheduled();

        // Tab filters
        switch ($tab) {
            case 'upcoming':
                $query->upcoming();
                break;
            case 'past':
                $query->past();
                break;
            case 'all':
                // No additional filter
                break;
        }

        // Other filters
        if ($search = $request->get('search')) {
            $query->search($search);
        }

        if ($categoryId = $request->get('category_id')) {
            $query->byCategory($categoryId);
        }

        if ($cityId = $request->get('city_id')) {
            $query->byCity($cityId);
        }

        // Sorting
        switch ($request->get('sort_by', 'start_date')) {
            case 'rating':
                $query->highestRated();
                break;
            case 'price-low':
                $query->priceAsc();
                break;
            case 'price-high':
                $query->priceDesc();
                break;
            case 'popularity':
                $query->popular();
                break;
            case 'start_date':
            default:
                $sortOrder = $request->get('sort_order', 'asc');
                $query->byStartDate($sortOrder);
                break;
        }

        $trainings = $query->paginate($request->get('per_page', 12));

        // Transform data
        $trainings->getCollection()->transform(function ($training) {
            return [
                'id' => $training->id,
                'title' => $training->title,
                'slug' => $training->slug,
                'short_description' => $training->short_description,
                'image_url' => $training->image_url,
                'city' => [
                    'name' => optional($training->city)->name ?? '',
                ],
                'formatted_date' => $training->formatted_date,
                'formatted_price' => $training->formatted_price,
                'formatted_original_price' => $training->formatted_original_price,
                'duration_days' => $training->duration_days,
                'max_seats' => $training->max_seats,
                'available_seats' => $training->available_seats,
                'rating' => $training->rating,
                'total_reviews' => $training->total_reviews,
                'is_popular' => $training->is_popular,
                'is_full' => $training->is_full,
                'price' => $training->price,
                'original_price' => $training->original_price,
                'category' => [
                    'name' => optional($training->category)->name ?? '',
                ],
                'trainer' => [
                    'name' => optional($training->trainer)->name ?? '',
                    'rating' => optional($training->trainer)->rating ?? 0,
                ],
                'mode' => 'in-person',
                'can_register' => $training->can_register,
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

    /**
     * Get filter data (categories and cities)
     */
    public function filtersData(): JsonResponse
    {
        $cacheKey = 'training_filters_data';
        
        $data = Cache::remember($cacheKey, 3600, function () {
            return [
                'categories' => Category::active()
                    ->orderBy('sort_order')
                    ->get()
                    ->map(function ($category) {
                        return [
                            'id' => $category->id,
                            'name' => $category->name,
                            'trainings_count' => $category->total_count,
                        ];
                    }),
                'cities' => City::active()
                    ->orderBy('name')
                    ->get()
                    ->map(function ($city) {
                        return [
                            'id' => $city->id,
                            'name' => $city->name,
                            'trainings_count' => $city->trainings_count,
                        ];
                    }),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Get form data for creating/editing trainings
     */
    public function getFormData(Request $request): JsonResponse
    {
        $mode = $request->get('mode', 'online');

        $data = [
            'categories' => Category::active()
                ->orderBy('sort_order')
                ->get()
                ->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                    ];
                }),
            'trainers' => \App\Models\Trainer::active()
                ->orderBy('name')
                ->get()
                ->map(function ($trainer) {
                    return [
                        'id' => $trainer->id,
                        'name' => $trainer->name,
                    ];
                }),
        ];

        if ($mode === 'in-person') {
            $data['cities'] = City::active()
                ->orderBy('name')
                ->get()
                ->map(function ($city) {
                    return [
                        'id' => $city->id,
                        'name' => $city->name,
                    ];
                });
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Store a new course
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'required|string|max:500',
            'category_id' => 'required|exists:categories,id',
            'trainer_id' => 'required|exists:trainers,id',
            'level' => 'required|in:beginner,intermediate,advanced',
            'type' => 'required|in:video,live,hybrid',
            'difficulty' => 'required|in:easy,medium,hard',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'image' => 'nullable|string',
            'skills' => 'nullable|array',
            'is_trending' => 'boolean',
            'is_bestseller' => 'boolean',
            'is_new' => 'boolean',
        ]);

        $course = Course::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Course created successfully',
            'data' => $course
        ], 201);
    }

    /**
     * Update a course
     */
    public function update(Request $request, $id): JsonResponse
    {
        $course = Course::findOrFail($id);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'short_description' => 'string|max:500',
            'category_id' => 'exists:categories,id',
            'trainer_id' => 'exists:trainers,id',
            'level' => 'in:beginner,intermediate,advanced',
            'type' => 'in:video,live,hybrid',
            'difficulty' => 'in:easy,medium,hard',
            'price' => 'numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'duration' => 'integer|min:1',
            'image' => 'nullable|string',
            'skills' => 'nullable|array',
            'is_trending' => 'boolean',
            'is_bestseller' => 'boolean',
            'is_new' => 'boolean',
        ]);

        $course->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Course updated successfully',
            'data' => $course->fresh()
        ]);
    }

    /**
     * Delete a course
     */
    public function destroy($id): JsonResponse
    {
        $course = Course::findOrFail($id);
        $course->delete();

        return response()->json([
            'success' => true,
            'message' => 'Course deleted successfully'
        ]);
    }

    /**
     * Get training details
     */
    public function show($id, Request $request): JsonResponse
    {
        $mode = $request->get('mode', 'online');
        
        if ($mode === 'online') {
            $training = Course::with(['category', 'trainer', 'modules.lessons'])
                ->active()
                ->findOrFail($id);
                
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $training->id,
                    'title' => $training->title,
                    'slug' => $training->slug,
                    'description' => $training->description,
                    'short_description' => $training->short_description,
                    'image' => $training->image_url,
                    'category' => optional($training->category)->name ?? '',
                    'level' => ucfirst($training->level),
                    'type' => ucfirst($training->type),
                    'difficulty' => ucfirst($training->difficulty),
                    'price' => $training->price,
                    'original_price' => $training->original_price,
                    'formatted_price' => $training->formatted_price,
                    'formatted_original_price' => $training->formatted_original_price,
                    'discount' => $training->discount_percentage,
                    'duration' => $training->duration_formatted,
                    'modules_count' => $training->modules_count,
                    'modules' => $training->modules,
                    'skills' => $training->skills,
                    'rating' => $training->rating,
                    'total_reviews' => $training->total_reviews,
                    'total_students' => $training->total_students,
                    'instructor' => [
                        'name' => optional($training->trainer)->name ?? '',
                        'bio' => optional($training->trainer)->bio ?? '',
                        'avatar' => optional($training->trainer)->avatar_url ?? '',
                        'rating' => optional($training->trainer)->rating ?? 0,
                        'specialties' => optional($training->trainer)->specialties ?? [],
                    ],
                    'mode' => 'online',
                ]
            ]);
        } else {
            $training = InPersonTraining::with(['category', 'city', 'trainer'])
                ->active()
                ->findOrFail($id);
                
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $training->id,
                    'title' => $training->title,
                    'slug' => $training->slug,
                    'description' => $training->description,
                    'short_description' => $training->short_description,
                    'image' => $training->image_url,
                    'category' => optional($training->category)->name ?? '',
                    'city' => optional($training->city)->name ?? '',
                    'price' => $training->price,
                    'original_price' => $training->original_price,
                    'formatted_price' => $training->formatted_price,
                    'formatted_original_price' => $training->formatted_original_price,
                    'discount' => $training->discount_percentage,
                    'duration_days' => $training->duration_days,
                    'formatted_date' => $training->formatted_date,
                    'start_date' => $training->start_date->format('Y-m-d'),
                    'end_date' => $training->end_date->format('Y-m-d'),
                    'start_time' => $training->start_time->format('H:i'),
                    'end_time' => $training->end_time->format('H:i'),
                    'venue_name' => $training->venue_name,
                    'venue_address' => $training->venue_address,
                    'max_seats' => $training->max_seats,
                    'available_seats' => $training->available_seats,
                    'is_full' => $training->is_full,
                    'rating' => $training->rating,
                    'total_reviews' => $training->total_reviews,
                    'trainer' => [
                        'name' => optional($training->trainer)->name ?? '',
                        'bio' => optional($training->trainer)->bio ?? '',
                        'avatar' => optional($training->trainer)->avatar_url ?? '',
                        'rating' => optional($training->trainer)->rating ?? 0,
                        'specialties' => optional($training->trainer)->specialties ?? [],
                    ],
                    'can_register' => $training->can_register,
                    'mode' => 'in-person',
                ]
            ]);
        }
    }
}
