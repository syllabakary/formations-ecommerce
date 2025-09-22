<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Requests;
use App\Http\Controllers\api\TrainingController;
use App\Http\Controllers\api\TrainingRegistrationController;
use App\Http\Controllers\api\DashboardController;
use App\Http\Controllers\admin\ManagerUserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
// Routes publiques d'authentification
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/resend-otp', [AuthController::class, 'resendOtp']);


Route::prefix('v1')->group(function () {
    // Formations
    Route::get('/trainings', [TrainingController::class, 'index']);
    Route::get('/trainings/{id}', [TrainingController::class, 'show']);
    Route::get('/trainings/filters/data', [TrainingController::class, 'getFiltersData']);
    
    // Inscriptions
    Route::post('/registrations', [TrainingRegistrationController::class, 'store']);
    Route::get('/trainings/{id}/availability', [TrainingRegistrationController::class, 'checkAvailability']);
    
    // Dashboard/Stats
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
    Route::get('/dashboard/popular-trainings', [DashboardController::class, 'getPopularTrainings']);
});





// Routes protégées par Sanctum (utilisateurs connectés)
Route::middleware('auth:sanctum')->group(function () {
    // Authentification
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Dashboard général
    Route::get('/dashboard', function (Request $request) {
        return response()->json([
            'success' => true,
            'message' => 'Bienvenue sur le dashboard !',
            'user' => $request->user()
        ]);
    });
    
    // Routes admin (nécessite le rôle Admin)
    Route::prefix('admin')->group(function () {
        // Gestion des utilisateurs
        Route::get('/users', [ManagerUserController ::class, 'getUsers']);
        Route::post('/users', [ManagerUserController ::class, 'createUser']);
        Route::get('/users/{id}', [ManagerUserController ::class, 'getUserById']);
        Route::put('/users/{id}', [ManagerUserController ::class, 'updateUser']);
        Route::delete('/users/{id}', [ManagerUserController ::class, 'deleteUser']);
         
        // Actions en lot
        Route::post('/users/bulk-delete', [ManagerUserController ::class, 'bulkDeleteUsers']);
        
        // Gestion des statuts
        Route::patch('/users/{id}/status', [ManagerUserController ::class, 'toggleUserStatus']);
        Route::patch('/users/{id}/reset-password', [ManagerUserController ::class, 'resetUserPassword']);
        
        // Statistiques admin
        Route::get('/stats', [ManagerUserController ::class, 'getDashboardStats']);
    });
});

// Routes pour les instructeurs (nécessite le rôle Instructeur ou Admin)
Route::middleware(['auth:sanctum', 'role:Instructeur,Admin'])->group(function () {
    Route::prefix('instructor')->group(function () {
        // Gestion des cours (à implémenter selon vos besoins)
        Route::get('/courses', function () {
            return response()->json(['message' => 'Mes cours']);
        });
    });
});

// Routes pour les étudiants (tous les utilisateurs connectés)
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('student')->group(function () {
        // Profil étudiant
        Route::get('/profile', function (Request $request) {
            return response()->json([
                'success' => true,
                'data' => $request->user()
            ]);
        });
        
        // Formations de l'étudiant (à implémenter selon vos besoins)
        Route::get('/courses', function () {
            return response()->json(['message' => 'Mes formations']);
        });
    });
});
