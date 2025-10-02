<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Upload functionality not yet implemented'
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => []
        ]);
    }

    public function destroy($media): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Media deleted'
        ]);
    }
}
