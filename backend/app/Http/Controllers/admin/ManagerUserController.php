<?php
// app/Http/Controllers/Admin/ManagerUserController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ManagerUserController extends Controller
{
    /**
     * Obtenir un utilisateur par ID
     */
    public function getUserById($id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }
    }

    /**
     * Mettre à jour un utilisateur
     */
    public function updateUser(Request $request, $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => ['required', 'email', Rule::unique('users')->ignore($id)],
                'phone' => ['required', 'string', Rule::unique('users')->ignore($id)],
                'role' => 'required|in:Étudiant,Instructeur,Admin',
                'status' => 'nullable|in:Actif,Inactif,Suspendu',
                'password' => 'nullable|string|min:6',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            $updateData = [
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'role' => $request->role,
                'status' => $request->status ?? $user->status,
            ];

            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $user->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur mis à jour avec succès',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un utilisateur
     */
    public function deleteUser($id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            // Empêcher la suppression de son propre compte
            if ($user->id === auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous ne pouvez pas supprimer votre propre compte'
                ], 403);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Suppression en masse
     */
    public function bulkDeleteUsers(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_ids' => 'required|array',
                'user_ids.*' => 'exists:users,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Empêcher la suppression de son propre compte
            $userIds = array_diff($request->user_ids, [auth()->id()]);

            User::whereIn('id', $userIds)->delete();

            return response()->json([
                'success' => true,
                'message' => count($userIds) . ' utilisateur(s) supprimé(s)'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression en masse'
            ], 500);
        }
    }

    /**
     * Changer le statut d'un utilisateur
     */
    public function toggleUserStatus(Request $request, $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'status' => 'required|in:Actif,Inactif,Suspendu'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $user->update(['status' => $request->status]);

            return response()->json([
                'success' => true,
                'message' => 'Statut mis à jour avec succès',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du statut'
            ], 500);
        }
    }

    /**
     * Réinitialiser le mot de passe
     */
    public function resetUserPassword(Request $request, $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'new_password' => 'required|string|min:6',
                'new_password_confirmation' => 'required|same:new_password'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $user->update([
                'password' => Hash::make($request->new_password)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Mot de passe réinitialisé avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la réinitialisation du mot de passe'
            ], 500);
        }
    }

    /**
     * Liste des utilisateurs avec pagination et filtres
     */
    public function getUsers(Request $request): JsonResponse
    {
        try {
            $perPage = $request->input('per_page', 10);
            $search = $request->input('search');
            $role = $request->input('role');
            $status = $request->input('status');

            $query = User::query();

            // Recherche
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%")
                      ->orWhere('phone', 'LIKE', "%{$search}%");
                });
            }

            // Filtre par rôle
            if ($role && $role !== 'all') {
                $query->where('role', $role);
            }

            // Filtre par statut
            if ($status && $status !== 'all') {
                $query->where('status', $status);
            }

            $users = $query->orderBy('created_at', 'desc')->paginate($perPage);

            // ✅ Transformer les données pour assurer la compatibilité
            $usersData = $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name ?? 'Sans nom',
                    'email' => $user->email,
                    'phone' => $user->phone ?? 'Non renseigné',
                    'role' => $user->role ?? 'Étudiant',
                    'status' => $user->status ?? 'Actif',
                    'avatar' => $user->avatar ?? 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
                    'is_verified' => (bool) ($user->email_verified_at !== null),
                    'join_date' => $user->created_at->format('Y-m-d'),
                    'last_active' => $user->updated_at->diffForHumans(),
                    'courses_enrolled' => $user->getEnrollmentsCount(),
                    'courses_completed' => $user->getCompletedEnrollmentsCount(),
                    'courses_created' => $user->role === 'Instructeur' ? ($user->courses()->count() ?? 0) : null,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'data' => $usersData,
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total(),
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Erreur getUsers: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des utilisateurs: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Stats du dashboard
     */
    public function getDashboardStats(): JsonResponse
    {
        try {
            $total = User::count();
            $students = User::where('role', 'Étudiant')->count();
            $instructors = User::where('role', 'Instructeur')->count();
            $active = User::where('status', 'Actif')->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total' => $total,
                    'students' => $students,
                    'instructors' => $instructors,
                    'active' => $active,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des statistiques'
            ], 500);
        }
    }

    /**
     * Créer un utilisateur
     */
    public function createUser(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'phone' => 'required|string|unique:users,phone',
                'password' => 'required|string|min:6',
                'role' => 'required|in:Étudiant,Instructeur,Admin',
                'status' => 'nullable|in:Actif,Inactif,Suspendu',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'status' => $request->status ?? 'Actif',
                'email_verified_at' => now(), // Auto-vérifié pour admin
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur créé avec succès',
                'data' => $user
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création: ' . $e->getMessage()
            ], 500);
        }
    }
}
