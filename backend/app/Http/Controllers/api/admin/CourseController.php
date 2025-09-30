<?php
// app/Http/Controllers/Api/Admin/CourseController.php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Admin\StoreCourseRequest;
use App\Http\Requests\Admin\UpdateCourseRequest;

class CourseController extends Controller
{
    /**
     * Liste des formations en ligne avec pagination et filtres
     */
    public function index(Request $request)
    {
        $query = Course::with(['category:id,name', 'trainer:id,name'])
            ->withCount('enrollments as total_students');

        // Recherche
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filtre par catégorie
        if ($request->has('category') && !empty($request->category)) {
            $query->where('category_id', $request->category);
        }

        // Filtre par statut
        if ($request->has('status') && $request->status !== '') {
            $query->where('is_active', $request->status === 'active');
        }

        // Tri
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $courses = $query->paginate($perPage);

        // Formatter les données
        $courses->getCollection()->transform(function ($course) {
            return [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'short_description' => $course->short_description,
                'description' => $course->description,
                'image' => $course->image ? Storage::url($course->image) : null,
                'category' => $course->category,
                'trainer' => $course->trainer,
                'price' => $course->price,
                'original_price' => $course->original_price,
                'formatted_price' => number_format($course->price, 0, ',', ' ') . ' F CFA',
                'level' => $course->level,
                'type' => $course->type,
                'difficulty' => $course->difficulty,
                'duration_hours' => $course->duration_hours,
                'skills' => $course->skills ? json_decode($course->skills) : [],
                'total_students' => $course->total_students ?? 0,
                'is_active' => $course->is_active,
                'is_trending' => $course->is_trending,
                'is_bestseller' => $course->is_bestseller,
                'is_new' => $course->is_new,
                'access_link' => $course->access_link,
                'video_url' => $course->video_url,
                'created_at' => $course->created_at,
                'updated_at' => $course->updated_at,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $courses
        ]);
    }

    /**
     * Obtenir les données nécessaires pour le formulaire
     */
    public function formData()
    {
        $categories = Category::where('is_active', true)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        $trainers = User::where('role', 'instructor')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'categories' => $categories,
                'trainers' => $trainers
            ]
        ]);
    }

    /**
     * Créer une nouvelle formation en ligne
     */
    public function store(StoreCourseRequest $request)
    {
        $validated = $request->validated();

        // Store trainer_name directly as plain text
        // trainer_id is optional and can be null

        // Traitement de l'image
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('courses', 'public');
        }

        // Génération du slug
        $validated['slug'] = Str::slug($validated['title']);

        // Encoder les compétences
        if (isset($validated['skills'])) {
            $validated['skills'] = json_encode($validated['skills']);
        }

        // Set published_at if is_active and not already set
        if (($validated['is_active'] ?? false) && !isset($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $course = Course::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Formation en ligne créée avec succès',
            'data' => $course->load(['category:id,name', 'trainer:id,name'])
        ], 201);
    }

    /**
     * Afficher une formation en ligne
     */
    public function show(Course $course)
    {
        $course->load(['category:id,name', 'trainer:id,name'])
               ->loadCount('enrollments as total_students');

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'short_description' => $course->short_description,
                'description' => $course->description,
                'image' => $course->image ? Storage::url($course->image) : null,
                'category' => $course->category,
                'trainer' => $course->trainer,
                'price' => $course->price,
                'original_price' => $course->original_price,
                'formatted_price' => number_format($course->price, 0, ',', ' ') . ' F CFA',
                'level' => $course->level,
                'type' => $course->type,
                'difficulty' => $course->difficulty,
                'duration_hours' => $course->duration_hours,
                'skills' => $course->skills ? json_decode($course->skills) : [],
                'total_students' => $course->total_students ?? 0,
                'is_active' => $course->is_active,
                'is_trending' => $course->is_trending,
                'is_bestseller' => $course->is_bestseller,
                'is_new' => $course->is_new,
                'access_link' => $course->access_link,
                'video_url' => $course->video_url,
                'created_at' => $course->created_at,
                'updated_at' => $course->updated_at,
            ]
        ]);
    }

    /**
     * Mettre à jour une formation en ligne
     */
    public function update(UpdateCourseRequest $request, Course $course)
    {
        $validated = $request->validated();

        // Store trainer_name directly as plain text
        // trainer_id is optional and can be null

        // Traitement de l'image
        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image
            if ($course->image) {
                Storage::disk('public')->delete($course->image);
            }
            $validated['image'] = $request->file('image')->store('courses', 'public');
        }

        // Génération du slug si le titre a changé
        if ($validated['title'] !== $course->title) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Encoder les compétences
        if (isset($validated['skills'])) {
            $validated['skills'] = json_encode($validated['skills']);
        }

        $course->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Formation en ligne mise à jour avec succès',
            'data' => $course->fresh()->load(['category:id,name', 'trainer:id,name'])
        ]);
    }

    /**
     * Supprimer une formation en ligne
     */
    public function destroy(Course $course)
    {
        // Vérifier s'il y a des inscriptions
        $enrollmentsCount = $course->enrollments()->count();
        
        if ($enrollmentsCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "Impossible de supprimer cette formation car elle a {$enrollmentsCount} inscription(s)"
            ], 422);
        }

        // Supprimer l'image associée
        if ($course->image) {
            Storage::disk('public')->delete($course->image);
        }

        $course->delete();

        return response()->json([
            'success' => true,
            'message' => 'Formation en ligne supprimée avec succès'
        ]);
    }

    /**
     * Basculer le statut actif/inactif
     */
    public function toggleStatus(Course $course)
    {
        $course->update(['is_active' => !$course->is_active]);

        return response()->json([
            'success' => true,
            'message' => $course->is_active ? 'Formation activée' : 'Formation désactivée',
            'data' => $course->fresh()
        ]);
    }
}
