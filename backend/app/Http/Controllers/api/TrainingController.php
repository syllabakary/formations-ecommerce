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
                'short_description' => $course->short_description,
                'description' => $course->description,
                'image' => $course->image,
                'image_url' => $course->image_url,
                'type' => $course->type,
                'level' => $course->level,
                'difficulty' => $course->difficulty,
                'price' => $course->price,
                'original_price' => $course->original_price,
                'formatted_price' => $course->formatted_price,
                'formatted_original_price' => $course->formatted_original_price,
                'discount_percentage' => $course->discount_percentage,
                'duration_hours' => $course->duration,
                'duration_formatted' => $course->duration_formatted,
                'skills' => $course->skills,
                'rating' => $course->rating,
                'total_reviews' => $course->total_reviews,
                'total_students' => $course->total_students,
                'is_trending' => $course->is_trending,
                'is_bestseller' => $course->is_bestseller,
                'is_new' => $course->is_new,
                'is_active' => $course->is_active,
                'category' => [
                    'id' => optional($course->category)->id ?? null,
                    'name' => optional($course->category)->name ?? '',
                ],
                'trainer' => [
                    'id' => optional($course->trainer)->id ?? null,
                    'name' => optional($course->trainer)->name ?? '',
                    'email' => optional($course->trainer)->email ?? '',
                ],
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
        $status = $request->get('status'); // Allow filtering by specific status

        $query = InPersonTraining::query()
            ->with(['category', 'city', 'trainer'])
            ->active(); // Only active trainings

        // Status filter - if specific status requested, use it
        if ($status) {
            $query->byStatus($status);
        } else {
            // Default behavior: show all active trainings regardless of status
            // This allows completed and cancelled trainings to be shown if needed
        }

        // Tab filters (for backward compatibility)
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
                'description' => $training->description,
                'image' => $training->image,
                'image_url' => $training->image_url,
                'city' => [
                    'id' => optional($training->city)->id ?? null,
                    'name' => optional($training->city)->name ?? '',
                ],
                'formatted_date' => $training->formatted_date,
                'formatted_price' => $training->formatted_price,
                'formatted_original_price' => $training->formatted_original_price,
                'discount_percentage' => $training->discount_percentage,
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
                    'id' => optional($training->category)->id ?? null,
                    'name' => optional($training->category)->name ?? '',
                ],
                'trainer' => [
                    'id' => optional($training->trainer)->id ?? null,
                    'name' => optional($training->trainer)->name ?? '',
                    'email' => optional($training->trainer)->email ?? '',
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
     * Store a new course or in-person training
     */
    public function store(Request $request): JsonResponse
    {
        $mode = $request->get('mode');

        // Auto-detect mode if not provided
        if (!$mode) {
            if ($request->has('city_name')) {
                $mode = 'in-person';
            } elseif ($request->has('trainer_id')) {
                $mode = 'online';
            } else {
                $mode = 'online'; // default
            }
        }

        if ($mode === 'online') {
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
        } else {
            // In-person training validation
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'short_description' => 'required|string|max:500',
                'category_id' => 'required|exists:categories,id',
                'trainer_name' => 'required|string|max:255',
                'city_name' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'original_price' => 'nullable|numeric|min:0',
                'duration_days' => 'required|integer|min:1',
                'start_date' => 'required|date|after:today',
                'end_date' => 'required|date|after_or_equal:start_date',
                'start_time' => 'required|date_format:H:i',
                'end_time' => 'required|date_format:H:i|after:start_time',
                'venue_name' => 'required|string|max:255',
                'venue_address' => 'required|string',
                'max_seats' => 'required|integer|min:1',
                'status' => 'required|in:scheduled,ongoing,completed,cancelled',
                'is_popular' => 'boolean',
                'registration_deadline' => 'nullable|date|before:start_date',
                'image' => 'nullable|string',
            ]);

            // Find or create city
            $city = City::firstOrCreate(
                ['name' => $validated['city_name']],
                ['is_active' => true]
            );
            $validated['city_id'] = $city->id;
            unset($validated['city_name']);

            // Handle trainer
            $trainer = \App\Models\Trainer::whereRaw("CONCAT(first_name, ' ', last_name) = ?", [$validated['trainer_name']])->first();
            if (!$trainer) {
                $trainer = \App\Models\Trainer::create([
                    'first_name' => $validated['trainer_name'],
                    'last_name' => '',
                    'is_active' => true,
                ]);
            }
            $validated['trainer_id'] = $trainer->id;
            unset($validated['trainer_name']);

            // Generate slug
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']);

            $training = InPersonTraining::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'In-person training created successfully',
                'data' => $training->load(['category', 'city', 'trainer'])
            ], 201);
        }
    }

    /**
     * Update a course or in-person training
     */
    public function update(Request $request, $id): JsonResponse
    {
        $mode = $request->get('mode');

        // Auto-detect mode if not provided
        if (!$mode) {
            if ($request->has('city_name') || $request->has('trainer_name')) {
                $mode = 'in-person';
            } elseif ($request->has('trainer_id')) {
                $mode = 'online';
            } else {
                $mode = 'online'; // default
            }
        }

        if ($mode === 'online') {
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
        } else {
            $training = InPersonTraining::findOrFail($id);

            $validated = $request->validate([
                'title' => 'string|max:255',
                'description' => 'string',
                'short_description' => 'string|max:500',
                'category_id' => 'exists:categories,id',
                'trainer_name' => 'string|max:255',
                'city_name' => 'string|max:255',
                'price' => 'numeric|min:0',
                'original_price' => 'nullable|numeric|min:0',
                'duration_days' => 'integer|min:1',
                'start_date' => 'date|after:today',
                'end_date' => 'date|after_or_equal:start_date',
                'start_time' => 'date_format:H:i',
                'end_time' => 'date_format:H:i|after:start_time',
                'venue_name' => 'string|max:255',
                'venue_address' => 'string',
                'max_seats' => 'integer|min:1',
                'status' => 'in:scheduled,ongoing,completed,cancelled',
                'is_popular' => 'boolean',
                'registration_deadline' => 'nullable|date|before:start_date',
                'image' => 'nullable|string',
            ]);

            // Handle city update
            if (isset($validated['city_name'])) {
                $city = City::firstOrCreate(
                    ['name' => $validated['city_name']],
                    ['is_active' => true]
                );
                $validated['city_id'] = $city->id;
                unset($validated['city_name']);
            }

            // Handle trainer update
            if (isset($validated['trainer_name'])) {
                $trainer = \App\Models\Trainer::whereRaw("CONCAT(first_name, ' ', last_name) = ?", [$validated['trainer_name']])->first();
                if (!$trainer) {
                    $trainer = \App\Models\Trainer::create([
                        'first_name' => $validated['trainer_name'],
                        'last_name' => '',
                        'is_active' => true,
                    ]);
                }
                $validated['trainer_id'] = $trainer->id;
                unset($validated['trainer_name']);
            }

            // Update slug if title changed
            if (isset($validated['title'])) {
                $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']);
            }

            $training->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'In-person training updated successfully',
                'data' => $training->fresh()->load(['category', 'city', 'trainer'])
            ]);
        }
    }

    /**
     * Delete a course or in-person training
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $mode = $request->get('mode');

        // Auto-detect mode if not provided
        if (!$mode) {
            if (InPersonTraining::find($id)) {
                $mode = 'in-person';
            } else {
                $mode = 'online';
            }
        }

        if ($mode === 'online') {
            $course = Course::findOrFail($id);
            $course->delete();

            return response()->json([
                'success' => true,
                'message' => 'Course deleted successfully'
            ]);
        } else {
            $training = InPersonTraining::findOrFail($id);
            $training->delete();

            return response()->json([
                'success' => true,
                'message' => 'In-person training deleted successfully'
            ]);
        }
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
