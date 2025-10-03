<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Liste des catégories
     */
    public function index()
    {
        $categories = Category::withCount(['onlineCourses', 'inPersonTrainings'])
            ->orderBy('sort_order')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'description' => $category->description,
                    'icon' => $category->icon,
                    'color' => $category->color,
                    'is_active' => $category->is_active,
                    'sort_order' => $category->sort_order,
                    'online_courses_count' => $category->online_courses_count ?? 0,
                    'in_person_trainings_count' => $category->in_person_trainings_count ?? 0,
                    'total_trainings' => ($category->online_courses_count ?? 0) + ($category->in_person_trainings_count ?? 0),
                    'created_at' => $category->created_at,
                    'updated_at' => $category->updated_at
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Créer une nouvelle catégorie
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:50',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0'
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $category = Category::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Catégorie créée avec succès',
            'data' => $category
        ], 201);
    }

    /**
     * Afficher une catégorie
     */
    public function show(Category $category)
    {
        $category->loadCount(['onlineCourses', 'inPersonTrainings']);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'icon' => $category->icon,
                'color' => $category->color,
                'is_active' => $category->is_active,
                'sort_order' => $category->sort_order,
                'online_courses_count' => $category->online_courses_count ?? 0,
                'in_person_trainings_count' => $category->in_person_trainings_count ?? 0,
                'total_trainings' => ($category->online_courses_count ?? 0) + ($category->in_person_trainings_count ?? 0),
                'created_at' => $category->created_at,
                'updated_at' => $category->updated_at
            ]
        ]);
    }

    /**
     * Mettre à jour une catégorie
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:50',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0'
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Catégorie mise à jour avec succès',
            'data' => $category->fresh()
        ]);
    }

    /**
     * Supprimer une catégorie
     */
    public function destroy(Category $category)
    {
        // Vérifier s'il y a des formations liées
        $totalTrainings = $category->onlineCourses()->count() + $category->inPersonTrainings()->count();
        
        if ($totalTrainings > 0) {
            return response()->json([
                'success' => false,
                'message' => "Impossible de supprimer cette catégorie car elle contient {$totalTrainings} formation(s)"
            ], 422);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Catégorie supprimée avec succès'
        ]);
    }

    /**
     * Basculer le statut actif/inactif
     */
    public function toggleStatus(Category $category)
    {
        $category->update(['is_active' => !$category->is_active]);

        return response()->json([
            'success' => true,
            'message' => $category->is_active ? 'Catégorie activée' : 'Catégorie désactivée',
            'data' => $category->fresh()
        ]);
    }
}