<?php
// app/Http/Controllers/Api/ReviewController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewRequest;
use App\Models\Course;
use App\Models\InPersonTraining;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Get reviews for a training/course
     */
    public function index(Request $request): JsonResponse
    {
        $type = $request->get('type'); // 'course' or 'training'
        $id = $request->get('id');
        
        $modelClass = $type === 'course' ? Course::class : InPersonTraining::class;
        
        $reviews = Review::where('reviewable_type', $modelClass)
            ->where('reviewable_id', $id)
            ->approved()
            ->orderBy('reviewed_at', 'desc')
            ->paginate(10);

        $reviews->getCollection()->transform(function ($review) {
            return [
                'id' => $review->id,
                'reviewer_name' => $review->reviewer_name,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'reviewed_at' => $review->reviewed_at->format('d M Y'),
                'is_verified' => $review->is_verified,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $reviews->items(),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ]
        ]);
    }

    /**
     * Store a new review
     */
    public function store(ReviewRequest $request): JsonResponse
    {
        $data = $request->validated();
        
        $modelClass = $data['type'] === 'course' ? Course::class : InPersonTraining::class;
        
        // Check if item exists
        $item = $modelClass::findOrFail($data['id']);
        
        // Check if user already reviewed
        $existingReview = Review::where('reviewable_type', $modelClass)
            ->where('reviewable_id', $data['id'])
            ->where('reviewer_email', $data['reviewer_email'])
            ->first();
            
        if ($existingReview) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà évalué cette formation'
            ], 422);
        }

        $review = Review::create([
            'reviewer_name' => $data['reviewer_name'],
            'reviewer_email' => $data['reviewer_email'],
            'rating' => $data['rating'],
            'comment' => $data['comment'],
            'reviewed_at' => now(),
            'reviewable_type' => $modelClass,
            'reviewable_id' => $data['id'],
            'is_approved' => false, // Require admin approval
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Votre avis a été soumis et sera publié après modération',
            'data' => [
                'id' => $review->id,
            ]
        ], 201);
    }

    /**
     * Get review statistics
     */
    public function stats(Request $request): JsonResponse
    {
        $type = $request->get('type');
        $id = $request->get('id');
        
        $modelClass = $type === 'course' ? Course::class : InPersonTraining::class;
        
        $reviews = Review::where('reviewable_type', $modelClass)
            ->where('reviewable_id', $id)
            ->approved();
        
        $total = $reviews->count();
        $average = $total > 0 ? $reviews->avg('rating') : 0;
        
        $ratingCounts = [];
        for ($i = 1; $i <= 5; $i++) {
            $ratingCounts[$i] = $reviews->clone()->where('rating', $i)->count();
        }

        return response()->json([
            'success' => true,
            'data' => [
                'total_reviews' => $total,
                'average_rating' => round($average, 1),
                'rating_distribution' => $ratingCounts,
            ]
        ]);
    }
}