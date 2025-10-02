<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getStats(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => 0,
                'total_courses' => 0,
                'total_enrollments' => 0,
                'total_revenue' => 0
            ]
        ]);
    }

    public function getRevenue(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => []
        ]);
    }

    public function getFormations(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => []
        ]);
    }

    public function getStudents(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => []
        ]);
    }

    public function getRecentActivity(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => []
        ]);
    }
}
