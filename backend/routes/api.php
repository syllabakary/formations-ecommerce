<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Requests;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\TrainingRegistrationController;
use App\Http\Controllers\DashboardController;

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



// Routes protégées par Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Informations utilisateur
    Route::get('/user', [AuthController::class, 'user']);
    
    // Déconnexion
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Autres routes protégées...
    Route::get('/dashboard', function (Request $request) {
        return response()->json([
            'success' => true,
            'message' => 'Bienvenue sur le dashboard !',
            'user' => $request->user()
        ]);
    });
});

// Route de test
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API fonctionne !',
        'timestamp' => now()
    ]);
});