<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => []
        ]);
    }

    public function export(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Export functionality not yet implemented'
        ]);
    }
}
