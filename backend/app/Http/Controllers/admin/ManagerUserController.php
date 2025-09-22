<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ManagerUserController extends Controller
{
    /**
     * Constructeur - Middleware pour vérifier que l'utilisateur est admin
     */
    public function __construct()
    {
        $this->middleware(['auth:sanctum', 'admin']);
    }

    /**
     * Liste tous les utilisateurs avec pagination et filtres
     */
    public function getUsers(Request $request): JsonResponse
    {
        try {
            $query = User::query();

            // Recherche par nom ou email
            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%");
                });
            }

            // Filtre par rôle
            if ($request->filled('role') && $request->input('role') !== 'all') {
                $query->where('role', $request->input('role'));
            }

            // Filtre par statut
            if ($request->filled('status') && $request->input('status') !== 'all') {
                $query->where('status', $request->input('status'));
            }

            // Tri
            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->input('per_page', 15);
            $users = $query->paginate($perPage);

            // Ajouter des statistiques supplémentaires
            $users->getCollection()->transform(function ($user) {
                $user->courses_enrolled = $user->role === 'Étudiant' ? rand(0, 5) : 0;
                $user->courses_completed = $user->role === 'Étudiant' ? rand(0, $user->courses_enrolled) : 0;
                $user->courses_created = $user->role === 'Instructeur' ? rand(0, 3) : 0;
                $user->last_active = $this->getRandomLastActive();
                $user->join_date = $user->created_at->format('Y-m-d');
                return $user;
            });

            return response()->json([
                'success' => true,
                'data' => $users->items(),
                'pagination' => [
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total(),
                ],
                'stats' => $this->getUserStats()
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des utilisateurs: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Créer un nouvel utilisateur
     */
    public function createUser(Request $request): JsonResponse
    {
        try {
            // Validation
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'phone' => 'required|string|unique:users,phone',
                'role' => 'required|in:Étudiant,Instructeur,Admin',
                'password' => 'required|string|min:6',
                'status' => 'required|in:Actif,Inactif,Suspendu',
                'avatar' => 'nullable|url',
                'join_date' => 'nullable|date'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Créer l'utilisateur
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'role' => $request->role,
                'password' => Hash::make($request->password),
                'status' => $request->status,
                'avatar' => $request->avatar ?: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
                'email_verified_at' => Carbon::now(), // Auto-vérifier pour les admins
                'created_at' => $request->join_date ? Carbon::parse($request->join_date) : Carbon::now()
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

    /**
     * Mettre à jour un utilisateur
     */
    public function updateUser(Request $request, $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            // Validation
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $id,
                'phone' => 'required|string|unique:users,phone,' . $id,
                'role' => 'required|in:Étudiant,Instructeur,Admin',
                'status' => 'required|in:Actif,Inactif,Suspendu',
                'avatar' => 'nullable|url',
                'password' => 'nullable|string|min:6'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Mise à jour des données
            $updateData = [
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'role' => $request->role,
                'status' => $request->status,
                'avatar' => $request->avatar ?: $user->avatar
            ];

            // Mettre à jour le mot de passe seulement si fourni
            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $user->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur mis à jour avec succès',
                'data' => $user->fresh()
            ], 200);

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
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les détails d'un utilisateur
     */
    public function getUserById($id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            // Ajouter des stats personnalisées
            $user->courses_enrolled = $user->role === 'Étudiant' ? rand(0, 5) : 0;
            $user->courses_completed = $user->role === 'Étudiant' ? rand(0, $user->courses_enrolled) : 0;
            $user->courses_created = $user->role === 'Instructeur' ? rand(0, 3) : 0;
            $user->last_active = $this->getRandomLastActive();
            $user->join_date = $user->created_at->format('Y-m-d');

            return response()->json([
                'success' => true,
                'data' => $user
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Suspendre ou réactiver un utilisateur
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
                    'message' => 'Statut invalide',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user->update(['status' => $request->status]);

            return response()->json([
                'success' => true,
                'message' => "Statut de l'utilisateur mis à jour: {$request->status}",
                'data' => $user->fresh()
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du statut: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Réinitialiser le mot de passe d'un utilisateur
     */
    public function resetUserPassword(Request $request, $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'new_password' => 'required|string|min:6|confirmed'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mot de passe invalide',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user->update([
                'password' => Hash::make($request->new_password)
            ]);

            // Optionnel: Révoquer tous les tokens de l'utilisateur
            $user->tokens()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Mot de passe réinitialisé avec succès'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la réinitialisation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer plusieurs utilisateurs
     */
    public function bulkDeleteUsers(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_ids' => 'required|array|min:1',
                'user_ids.*' => 'exists:users,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'IDs utilisateurs invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userIds = $request->user_ids;

            // Empêcher la suppression de son propre compte
            if (in_array(auth()->id(), $userIds)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous ne pouvez pas supprimer votre propre compte'
                ], 403);
            }

            $deletedCount = User::whereIn('id', $userIds)->delete();

            return response()->json([
                'success' => true,
                'message' => "{$deletedCount} utilisateurs supprimés avec succès"
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les statistiques des utilisateurs
     */
    public function getDashboardStats(): JsonResponse
    {
        try {
            $stats = [
                'total_users' => User::count(),
                'active_users' => User::where('status', 'Actif')->count(),
                'students' => User::where('role', 'Étudiant')->count(),
                'instructors' => User::where('role', 'Instructeur')->count(),
                'admins' => User::where('role', 'Admin')->count(),
                'verified_users' => User::whereNotNull('email_verified_at')->count(),
                'new_users_this_month' => User::whereMonth('created_at', Carbon::now()->month)->count(),
                'inactive_users' => User::where('status', 'Inactif')->count(),
                'suspended_users' => User::where('status', 'Suspendu')->count(),
            ];

            // Statistiques par mois pour les graphiques
            $monthlyStats = [];
            for ($i = 11; $i >= 0; $i--) {
                $date = Carbon::now()->subMonths($i);
                $monthlyStats[] = [
                    'month' => $date->format('M Y'),
                    'users' => User::whereYear('created_at', $date->year)
                                  ->whereMonth('created_at', $date->month)
                                  ->count()
                ];
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'overview' => $stats,
                    'monthly_registrations' => $monthlyStats
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Méthodes privées
     */
    private function getUserStats(): array
    {
        return [
            'total' => User::count(),
            'students' => User::where('role', 'Étudiant')->count(),
            'instructors' => User::where('role', 'Instructeur')->count(),
            'admins' => User::where('role', 'Admin')->count(),
            'active' => User::where('status', 'Actif')->count(),
            'inactive' => User::where('status', 'Inactif')->count(),
            'suspended' => User::where('status', 'Suspendu')->count(),
        ];
    }

    private function getRandomLastActive(): string
    {
        $options = [
            'Il y a quelques instants',
            'Il y a 5 minutes',
            'Il y a 1 heure',
            'Il y a 3 heures',
            'Hier',
            'Il y a 2 jours',
            'Il y a 1 semaine'
        ];

        return $options[array_rand($options)];
    }
}