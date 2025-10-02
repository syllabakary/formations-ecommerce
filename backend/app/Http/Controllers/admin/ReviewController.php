<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [],
            'message' => 'Reviews list'
        ]);
    }

    public function approve(Request $request, $review): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Review approved'
        ]);
    }

    public function reject(Request $request, $review): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Review rejected'
        ]);
    }

    public function destroy($review): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Review deleted'
        ]);
    }
}
