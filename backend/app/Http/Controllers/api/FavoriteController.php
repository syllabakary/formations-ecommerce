<?php
// app/Http/Controllers/api/FavoriteController.php
// app/Http/Controllers/Api/FavoriteController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Favorite;
use App\Models\InPersonTraining;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FavoriteController extends Controller
{
    /**
     * Get user favorites
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $email = $request->get('email');

            if (!$email) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email requis'
                ], 400);
            }

            $favorites = Favorite::with(['favoritable' => function ($morphTo) {
                $morphTo->morphWith([
                    Course::class => ['category', 'trainer'],
                    InPersonTraining::class => ['category', 'city', 'trainer'],
                ]);
            }])
            ->byUser($email)
            ->get()
            ->filter(function ($favorite) {
                return $favorite->favoritable !== null;
            })
            ->map(function ($favorite) {
                $item = $favorite->favoritable;

                if (!$item) {
                    return null; // Skip if still null after filtering
                }

                if ($item instanceof Course) {
                    return [
                        'id' => $item->id,
                        'type' => 'course',
                        'title' => $item->title,
                        'description' => $item->short_description,
                        'image' => $item->image_url,
                        'price' => $item->formatted_price,
                        'category' => optional($item->category)->name ?? '',
                        'instructor' => optional($item->trainer)->name ?? '',
                        'rating' => $item->rating,
                        'mode' => 'online',
                    ];
                } else {
                    return [
                        'id' => $item->id,
                        'type' => 'training',
                        'title' => $item->title,
                        'description' => $item->short_description,
                        'image' => $item->image_url,
                        'price' => $item->formatted_price,
                        'category' => optional($item->category)->name ?? '',
                        'city' => optional($item->city)->name ?? '',
                        'date' => $item->formatted_date ?? '',
                        'instructor' => optional($item->trainer)->name ?? '',
                        'rating' => $item->rating,
                        'mode' => 'in-person',
                    ];
                }
            })
            ->filter(function ($item) {
                return $item !== null;
            })
            ->values();

            return response()->json([
                'success' => true,
                'data' => $favorites
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching favorites: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des favoris'
            ], 500);
        }
    }

    /**
     * Toggle favorite
     */
    public function toggle(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'type' => 'required|in:course,training',
            'id' => 'required|integer',
        ]);

        $email = $request->get('email');
        $type = $request->get('type');
        $id = $request->get('id');

        // Determine model class
        $modelClass = $type === 'course' ? Course::class : InPersonTraining::class;
        
        // Check if item exists
        $item = $modelClass::findOrFail($id);

        DB::beginTransaction();

        try {
            $favorite = Favorite::where('user_email', $email)
                ->where('favoritable_type', $modelClass)
                ->where('favoritable_id', $id)
                ->first();

            if ($favorite) {
                $favorite->delete();
                $action = 'removed';
            } else {
                Favorite::create([
                    'user_email' => $email,
                    'favoritable_type' => $modelClass,
                    'favoritable_id' => $id,
                ]);
                $action = 'added';
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'action' => $action,
                'message' => $action === 'added' 
                    ? 'Ajouté aux favoris'
                    : 'Retiré des favoris'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour des favoris'
            ], 500);
        }
    }
}

