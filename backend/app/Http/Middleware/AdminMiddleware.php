<?php

// app/Http/Middleware/AdminMiddleware.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Vérifier si l'utilisateur est connecté
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié'
            ], 401);
        }

        // Vérifier si l'utilisateur est admin ou instructor
        $user = auth()->user();
        if (!in_array($user->role, ['admin', 'instructor'])) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé. Rôle admin ou instructor requis.'
            ], 403);
        }

        return $next($request);
    }
}