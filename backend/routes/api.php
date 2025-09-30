<?php
// routes/api.php - Version corrigée et complète

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Auth
use App\Http\Controllers\AuthController;

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Public API
use App\Http\Controllers\Api\TrainingController;
use App\Http\Controllers\Api\TrainingRegistrationController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\ReviewController;

// User Management (Admin)
use App\Http\Controllers\Admin\ManagerUserController;

// Admin Modules
use App\Http\Controllers\Api\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\TrainerController as AdminTrainerController;
use App\Http\Controllers\Admin\InPersonTrainingController as AdminInPersonTrainingController;
use App\Http\Controllers\Admin\EnrollmentController as AdminEnrollmentController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\AnalyticsController as AdminAnalyticsController;
use App\Http\Controllers\Admin\ReportsController as AdminReportsController;
use App\Http\Controllers\Admin\MediaController as AdminMediaController;
use App\Http\Controllers\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\Admin\SearchController as AdminSearchController;
use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;



/*
|--------------------------------------------------------------------------
| API V1 (Public)
|--------------------------------------------------------------------------
*/
Route::prefix('v1')->group(function () {
    // Formations publiques
    Route::get('/courses', [TrainingController::class, 'index']);
    Route::get('/courses/{id}', [TrainingController::class, 'show']);
    Route::get('/courses/filters/data', [TrainingController::class, 'filtersData']);

    // Inscriptions
    Route::post('/registrations', [TrainingRegistrationController::class, 'store']);
    Route::get('/courses/{id}/availability', [TrainingRegistrationController::class, 'checkAvailability']);

    // Dashboard / Stats publiques
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
    Route::get('/dashboard/popular-trainings', [DashboardController::class, 'getPopularTrainings']);

    // Favorites (nécessite auth)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/favorites', [FavoriteController::class, 'index']);
        Route::post('/favorites/toggle', [FavoriteController::class, 'toggle']);
    });
});

/*
|--------------------------------------------------------------------------
| Routes protégées (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {

    // Auth
    Route::get('/user', [AuthController::class, 'user']);

    // Dashboard général
    Route::get('/dashboard', function (Request $request) {
        return response()->json([
            'success' => true,
            'message' => 'Bienvenue sur le dashboard !',
            'user'    => $request->user()
        ]);
    });

    /*
    |--------------------------------------------------------------------------
    | Admin Routes - ✅ Routes corrigées et complètes
    |--------------------------------------------------------------------------
    */
    Route::prefix('admin')->group(function () {

        // ✅ Route de test d'authentification (MANQUAIT)
        Route::get('/test-auth', function (Request $request) {
            return response()->json([
                'success' => true,
                'message' => 'Authentification réussie',
                'user' => [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role ?? 'admin'
                ]
            ]);
        });

        // Gestion des utilisateurs
        Route::get('/users', [ManagerUserController::class, 'getUsers']);
        Route::post('/users', [ManagerUserController::class, 'createUser']);
        Route::get('/users/{id}', [ManagerUserController::class, 'getUserById']);
        Route::put('/users/{id}', [ManagerUserController::class, 'updateUser']);
        Route::delete('/users/{id}', [ManagerUserController::class, 'deleteUser']);
        Route::post('/users/bulk-delete', [ManagerUserController::class, 'bulkDeleteUsers']);
        Route::patch('/users/{id}/status', [ManagerUserController::class, 'toggleUserStatus']);
        Route::patch('/users/{id}/reset-password', [ManagerUserController::class, 'resetUserPassword']);
        Route::get('/stats', [ManagerUserController::class, 'getDashboardStats']);

        // ✅ Categories (CRUD complet)
        Route::prefix('categories')->group(function () {
            Route::get('/', [AdminCategoryController::class, 'index']);
            Route::post('/', [AdminCategoryController::class, 'store']);
            Route::get('/{category}', [AdminCategoryController::class, 'show']);
            Route::put('/{category}', [AdminCategoryController::class, 'update']);
            Route::delete('/{category}', [AdminCategoryController::class, 'destroy']);
            Route::patch('/{category}/toggle-status', [AdminCategoryController::class, 'toggleStatus']);
            Route::patch('/update-order', [AdminCategoryController::class, 'updateOrder']);
        });

        // ✅ Formations en ligne (avec form-data)
        Route::prefix('courses')->group(function () {
            Route::get('/form-data', [AdminCourseController::class, 'formData']); // ✅ IMPORTANT
            Route::get('/', [AdminCourseController::class, 'index']);
            Route::get('/stats', [AdminCourseController::class, 'stats']);
            Route::get('/{course}', [AdminCourseController::class, 'show']);
            Route::post('/', [AdminCourseController::class, 'store']);
            Route::put('/{course}', [AdminCourseController::class, 'update']);
            Route::delete('/{course}', [AdminCourseController::class, 'destroy']);
            Route::post('/{course}/duplicate', [AdminCourseController::class, 'duplicate']);
            Route::patch('/{course}/toggle-published', [AdminCourseController::class, 'togglePublished']);
            Route::post('/bulk-action', [AdminCourseController::class, 'bulkAction']); // ✅ Actions en lot
        });

        // ✅ Formations en présentiel (avec form-data)
        Route::prefix('in-person-trainings')->group(function () {
            Route::get('/form-data', [AdminInPersonTrainingController::class, 'formData']); // ✅ IMPORTANT
            Route::get('/', [AdminInPersonTrainingController::class, 'index']);
            Route::get('/stats', [AdminInPersonTrainingController::class, 'stats']);
            Route::get('/{training}', [AdminInPersonTrainingController::class, 'show']);
            Route::post('/', [AdminInPersonTrainingController::class, 'store']);
            Route::put('/{training}', [AdminInPersonTrainingController::class, 'update']);
            Route::delete('/{training}', [AdminInPersonTrainingController::class, 'destroy']);
            Route::post('/{training}/duplicate', [AdminInPersonTrainingController::class, 'duplicate']);
            Route::patch('/{training}/toggle-status', [AdminInPersonTrainingController::class, 'toggleStatus']);
        });

        // Trainers/Formateurs
        Route::apiResource('trainers', AdminTrainerController::class);

        // Enrollments/Inscriptions
        Route::prefix('enrollments')->group(function () {
            Route::get('/', [AdminEnrollmentController::class, 'index']);
            Route::get('/export', [AdminEnrollmentController::class, 'export']);
            Route::patch('/{enrollment}/status', [AdminEnrollmentController::class, 'updateStatus']);
            Route::post('/{enrollment}/certificate', [AdminEnrollmentController::class, 'issueCertificate']);
        });

        // Reviews/Avis
        Route::prefix('reviews')->group(function () {
            Route::get('/', [AdminReviewController::class, 'index']);
            Route::patch('/{review}/approve', [AdminReviewController::class, 'approve']);
            Route::patch('/{review}/reject', [AdminReviewController::class, 'reject']);
            Route::delete('/{review}', [AdminReviewController::class, 'destroy']);
        });

        // ✅ Dashboard, Analytics & Reports (avec vraies données)
        Route::get('/dashboard/stats', [AdminDashboardController::class, 'getStats']);
        Route::get('/dashboard/revenue', [AdminDashboardController::class, 'getRevenue']);
        Route::get('/dashboard/formations', [AdminDashboardController::class, 'getFormations']);
        Route::get('/dashboard/students', [AdminDashboardController::class, 'getStudents']);
        Route::get('/dashboard/recent-activity', [AdminDashboardController::class, 'getRecentActivity']);
        Route::get('/analytics', [AdminAnalyticsController::class, 'index']);
        Route::get('/reports', [AdminReportsController::class, 'index']);
        Route::get('/reports/export', [AdminReportsController::class, 'export']);

        // Media
        Route::prefix('media')->group(function () {
            Route::post('/upload', [AdminMediaController::class, 'upload']);
            Route::get('/', [AdminMediaController::class, 'index']);
            Route::delete('/{media}', [AdminMediaController::class, 'destroy']);
        });

        // Settings
        Route::get('/settings', [AdminSettingsController::class, 'index']);
        Route::put('/settings', [AdminSettingsController::class, 'update']);

        // Utils
        Route::get('/search', [AdminSearchController::class, 'search']);
        Route::get('/notifications', [AdminNotificationController::class, 'index']);
        Route::patch('/notifications/{notification}/read', [AdminNotificationController::class, 'markAsRead']);
    });

    /*
    |--------------------------------------------------------------------------
    | Instructor routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:Instructeur,Admin')->prefix('instructor')->group(function () {
        Route::get('/courses', fn() => response()->json(['message' => 'Mes cours']));
    });

    /*
    |--------------------------------------------------------------------------
    | Student routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('student')->group(function () {
        Route::get('/profile', function (Request $request) {
            return response()->json(['success' => true, 'data' => $request->user()]);
        });
        Route::get('/courses', fn() => response()->json(['message' => 'Mes formations']));
    });
});

/*
|--------------------------------------------------------------------------
| ✅ Routes de fallback pour debugging
|--------------------------------------------------------------------------
*/
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Route non trouvée',
        'available_routes' => [
            'POST /api/login - Connexion',
            'GET /api/v1/admin/test-auth - Test authentification',
            'GET /api/v1/admin/categories - Liste des catégories',
            'GET /api/v1/admin/courses - Liste des formations en ligne',
            'GET /api/v1/admin/courses/form-data - Données pour formulaire',
            'GET /api/v1/admin/in-person-trainings - Formations présentiel',
        ]
    ], 404);
});