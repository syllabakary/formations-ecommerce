<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => []
        ]);
    }

    public function markAsRead(Request $request, $notification): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read'
        ]);
    }
}
