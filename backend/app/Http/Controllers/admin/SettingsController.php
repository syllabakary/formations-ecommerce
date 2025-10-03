<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'site_name' => 'Formation Platform',
                'site_email' => 'admin@example.com'
            ]
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Settings updated'
        ]);
    }
}
