<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Vérifier que l'utilisateur est authentifié
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié'
            ], 401);
        }

        // Vérifier que l'utilisateur a le rôle Admin
        if ($request->user()->role !== 'Admin') {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé. Droits administrateur requis.'
            ], 403);
        }

        // Vérifier que le compte est actif
        if ($request->user()->status !== 'Actif') {
            return response()->json([
                'success' => false,
                'message' => 'Compte suspendu ou inactif'
            ], 403);
        }

        return $next($request);
    }
}