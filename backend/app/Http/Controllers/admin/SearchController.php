<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $query = $request->input('q', '');
        
        return response()->json([
            'success' => true,
            'data' => [
                'courses' => [],
                'users' => [],
                'categories' => []
            ],
            'query' => $query
        ]);
    }
}
