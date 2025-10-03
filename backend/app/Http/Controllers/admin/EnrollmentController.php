<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [],
            'message' => 'Enrollments list'
        ]);
    }

    public function export(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Export functionality not yet implemented'
        ]);
    }

    public function updateStatus(Request $request, $enrollment): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Status updated'
        ]);
    }

    public function issueCertificate(Request $request, $enrollment): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Certificate issued'
        ]);
    }
}
