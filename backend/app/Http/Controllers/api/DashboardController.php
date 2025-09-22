<?php
// app/Http/Controllers/Api/DashboardController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Training;
use App\Models\TrainingRegistration;
use App\Models\TrainingCategory;
use App\Models\City;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats()
    {
        return Cache::remember('dashboard_stats', 900, function () { // 15 minutes
            $now = now();
            $startOfMonth = $now->copy()->startOfMonth();
            $endOfMonth = $now->copy()->endOfMonth();
            
            return [
                'trainings' => [
                    'total' => Training::active()->count(),
                    'upcoming' => Training::active()->upcoming()->count(),
                    'this_month' => Training::active()
                        ->whereBetween('start_date', [$startOfMonth, $endOfMonth])
                        ->count(),
                    'popular' => Training::active()->popular()->count()
                ],
                'registrations' => [
                    'total' => TrainingRegistration::where('status', 'confirmed')->count(),
                    'this_month' => TrainingRegistration::where('status', 'confirmed')
                        ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                        ->count(),
                    'revenue_this_month' => TrainingRegistration::where('status', 'confirmed')
                        ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                        ->sum('amount_paid')
                ],
                'categories' => [
                    'total' => TrainingCategory::active()->count(),
                    'with_trainings' => TrainingCategory::active()
                        ->whereHas('trainings', function($query) {
                            $query->active()->upcoming();
                        })->count()
                ],
                'cities' => [
                    'total' => City::active()->count(),
                    'with_trainings' => City::active()
                        ->whereHas('trainings', function($query) {
                            $query->active()->upcoming();
                        })->count()
                ]
            ];
        });
    }
    
    public function getPopularTrainings()
    {
        return Cache::remember('popular_trainings', 600, function () {
            return Training::active()
                ->upcoming()
                ->with(['category', 'city'])
                ->orderBy('is_popular', 'desc')
                ->orderBy('total_reviews', 'desc')
                ->orderBy('rating', 'desc')
                ->limit(6)
                ->get()
                ->map(function ($training) {
                    return [
                        'id' => $training->id,
                        'title' => $training->title,
                        'category' => $training->category->name,
                        'city' => $training->city->name,
                        'price' => $training->formatted_price,
                        'rating' => $training->rating,
                        'registered_count' => $training->registered_count,
                        'available_seats' => $training->available_seats,
                        'start_date' => $training->start_date->format('Y-m-d')
                    ];
                });
        });
    }
}
