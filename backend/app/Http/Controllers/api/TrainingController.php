<?php

// app/Http/Controllers/Api/TrainingController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Training;
use App\Models\TrainingCategory;
use App\Models\City;
use App\Http\Resources\TrainingResource;
use App\Http\Resources\TrainingDetailResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class TrainingController extends Controller
{
    public function index(Request $request)
    {
        $cacheKey = 'trainings_' . md5($request->getQueryString());
        
        return Cache::remember($cacheKey, 300, function () use ($request) { // 5 minutes cache
            $query = Training::active()->with(['category', 'city', 'trainer']);
            
            // Filtres
            if ($request->filled('search')) {
                $query->search($request->search);
            }
            
            if ($request->filled('city_id')) {
                $query->byCity($request->city_id);
            }
            
            if ($request->filled('category_id')) {
                $query->byCategory($request->category_id);
            }
            
            if ($request->filled('date_from')) {
                $query->where('start_date', '>=', $request->date_from);
            }
            
            if ($request->filled('date_to')) {
                $query->where('start_date', '<=', $request->date_to);
            }
            
            // Filtres par statut
            if ($request->filled('tab')) {
                switch ($request->tab) {
                    case 'upcoming':
                        $query->upcoming();
                        break;
                    case 'past':
                        $query->past();
                        break;
                    case 'popular':
                        $query->popular();
                        break;
                    // 'all' ne nécessite pas de filtre supplémentaire
                }
            } else {
                // Par défaut, afficher les formations à venir
                $query->upcoming();
            }
            
            // Tri
            $sortBy = $request->get('sort_by', 'start_date');
            $sortOrder = $request->get('sort_order', 'asc');
            
            switch ($sortBy) {
                case 'price':
                    $query->orderBy('price', $sortOrder);
                    break;
                case 'rating':
                    $query->orderBy('rating', 'desc')->orderBy('total_reviews', 'desc');
                    break;
                case 'popularity':
                    $query->orderBy('is_popular', 'desc')->orderBy('total_reviews', 'desc');
                    break;
                default:
                    $query->orderBy('start_date', $sortOrder);
            }
            
            $perPage = min($request->get('per_page', 12), 50); // Max 50 par page
            $trainings = $query->paginate($perPage);
            
            return [
                'data' => TrainingResource::collection($trainings),
                'meta' => [
                    'current_page' => $trainings->currentPage(),
                    'last_page' => $trainings->lastPage(),
                    'per_page' => $trainings->perPage(),
                    'total' => $trainings->total(),
                    'has_more' => $trainings->hasMorePages()
                ]
            ];
        });
    }
    
    public function show($id)
    {
        $training = Cache::remember("training_detail_{$id}", 600, function () use ($id) {
            return Training::active()
                ->with(['category', 'city', 'trainer', 'registrations' => function($query) {
                    $query->where('status', 'confirmed');
                }])
                ->findOrFail($id);
        });
        
        return new TrainingDetailResource($training);
    }
    
    public function getFiltersData()
    {
        return Cache::remember('training_filters_data', 1800, function () { // 30 minutes
            return [
                'categories' => TrainingCategory::active()
                    ->select('id', 'name', 'subcategories')
                    ->withCount(['trainings' => function($query) {
                        $query->active()->upcoming();
                    }])
                    ->having('trainings_count', '>', 0)
                    ->get(),
                    
                'cities' => City::active()
                    ->select('id', 'name')
                    ->withCount(['trainings' => function($query) {
                        $query->active()->upcoming();
                    }])
                    ->having('trainings_count', '>', 0)
                    ->orderBy('name')
                    ->get(),
                    
                'date_ranges' => [
                    [
                        'label' => 'Cette semaine',
                        'from' => now()->startOfWeek()->toDateString(),
                        'to' => now()->endOfWeek()->toDateString()
                    ],
                    [
                        'label' => 'Ce mois',
                        'from' => now()->startOfMonth()->toDateString(),
                        'to' => now()->endOfMonth()->toDateString()
                    ],
                    [
                        'label' => 'Prochains 3 mois',
                        'from' => now()->toDateString(),
                        'to' => now()->addMonths(3)->toDateString()
                    ]
                ],
                
                'stats' => [
                    'total_trainings' => Training::active()->upcoming()->count(),
                    'total_cities' => City::active()->whereHas('trainings', function($query) {
                        $query->active()->upcoming();
                    })->count(),
                    'average_price' => Training::active()->upcoming()->avg('price'),
                    'popular_count' => Training::active()->upcoming()->popular()->count()
                ]
            ];
        });
    }
}