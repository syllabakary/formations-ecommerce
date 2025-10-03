<?php

// app/Http/Controllers/Admin/InPersonTrainingController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InPersonTraining;
use App\Models\Category;
use App\Models\City;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Admin\StoreInPersonTrainingRequest;
use App\Http\Requests\Admin\UpdateInPersonTrainingRequest;

class InPersonTrainingController extends Controller
{
    /**
     * Liste des formations en présentiel
     */
    public function index(Request $request)
    {
        $query = InPersonTraining::with(['category:id,name', 'trainer', 'city:id,name']);

        // Recherche
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%")
                  ->orWhere('venue_name', 'like', "%{$search}%");
            });
        }

        // Filtres
        if ($request->has('category') && !empty($request->category)) {
            $query->where('category_id', $request->category);
        }

        if ($request->has('city') && !empty($request->city)) {
            $query->where('city_id', $request->city);
        }

        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        // Tri
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $trainings = $query->paginate($perPage);

        // Formatter les données
        $trainings->getCollection()->transform(function ($training) {
            return [
                'id' => $training->id,
                'title' => $training->title,
                'slug' => $training->slug,
                'short_description' => $training->short_description,
                'description' => $training->description,
                'image' => $training->image_url,
                'category' => $training->category,
                'trainer' => $training->trainer,
                'trainer_name' => $training->trainer_name,
                'city' => $training->city,
                'price' => $training->price,
                'original_price' => $training->original_price,
                'formatted_price' => $training->formatted_price,
                'duration_days' => $training->duration_days,
                'start_date' => $training->start_date,
                'end_date' => $training->end_date,
                'start_time' => $training->start_time,
                'end_time' => $training->end_time,
                'venue_name' => $training->venue_name,
                'venue_address' => $training->venue_address,
                'max_seats' => $training->max_seats,
                'registered_seats' => $training->registered_seats,
                'available_seats' => $training->available_seats,
                'status' => $training->status,
                'is_popular' => $training->is_popular,
                'is_active' => $training->is_active,
                'registration_deadline' => $training->registration_deadline,
                'created_at' => $training->created_at,
                'updated_at' => $training->updated_at,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $trainings
        ]);
    }

    /**
     * Données pour le formulaire
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

        $cities = City::where('is_active', true)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'categories' => $categories,
                'trainers' => $trainers,
                'cities' => $cities
            ]
        ]);
    }

    /**
     * Créer une formation en présentiel
     */
    public function store(StoreInPersonTrainingRequest $request)
    {
        $validated = $request->validated();

        // Auto-create trainer if not exists
        // Split full name into first_name and last_name
        $names = explode(' ', $validated['trainer_name'], 2);
        $firstName = $names[0];
        $lastName = $names[1] ?? '';

        // Provide unique default email to satisfy NOT NULL constraint
        $defaultEmail = strtolower($firstName) . '.' . strtolower($lastName) . '.' . time() . '@example.com';

        $trainer = \App\Models\Trainer::firstOrCreate(
            ['first_name' => $firstName, 'last_name' => $lastName],
            ['email' => $defaultEmail, 'is_active' => true]
        );
        $validated['trainer_id'] = $trainer->id;

        // Find or create city by name
        $city = City::firstOrCreate(
            ['name' => $validated['city_name']],
            ['is_active' => true]
        );
        $validated['city_id'] = $city->id;

        // Remove the city_name field from validated data
        unset($validated['city_name']);

        // Traitement de l'image
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('trainings', 'public');
        }

        // Génération du slug
        $validated['slug'] = Str::slug($validated['title']);

        $training = InPersonTraining::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Formation en présentiel créée avec succès',
            'data' => $training->load(['category:id,name', 'trainer', 'city:id,name'])
        ], 201);
    }

    /**
     * Afficher une formation
     */
    public function show(InPersonTraining $inPersonTraining)
    {
        $inPersonTraining->load(['category:id,name', 'trainer', 'city:id,name']);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $inPersonTraining->id,
                'title' => $inPersonTraining->title,
                'slug' => $inPersonTraining->slug,
                'short_description' => $inPersonTraining->short_description,
                'description' => $inPersonTraining->description,
                'image' => $inPersonTraining->image_url,
                'category' => $inPersonTraining->category,
                'trainer' => $inPersonTraining->trainer,
                'trainer_name' => $inPersonTraining->trainer_name,
                'city' => $inPersonTraining->city,
                'price' => $inPersonTraining->price,
                'original_price' => $inPersonTraining->original_price,
                'formatted_price' => $inPersonTraining->formatted_price,
                'duration_days' => $inPersonTraining->duration_days,
                'start_date' => $inPersonTraining->start_date,
                'end_date' => $inPersonTraining->end_date,
                'start_time' => $inPersonTraining->start_time,
                'end_time' => $inPersonTraining->end_time,
                'venue_name' => $inPersonTraining->venue_name,
                'venue_address' => $inPersonTraining->venue_address,
                'max_seats' => $inPersonTraining->max_seats,
                'registered_seats' => $inPersonTraining->registered_seats,
                'available_seats' => $inPersonTraining->available_seats,
                'status' => $inPersonTraining->status,
                'is_popular' => $inPersonTraining->is_popular,
                'is_active' => $inPersonTraining->is_active,
                'registration_deadline' => $inPersonTraining->registration_deadline,
                'created_at' => $inPersonTraining->created_at,
                'updated_at' => $inPersonTraining->updated_at,
            ]
        ]);
    }

    /**
     * Mettre à jour une formation
     */
    public function update(UpdateInPersonTrainingRequest $request, InPersonTraining $inPersonTraining)
    {
        $validated = $request->validated();

        // Auto-create trainer if not exists
        if (isset($validated['trainer_name'])) {
            // Split full name into first_name and last_name
            $names = explode(' ', $validated['trainer_name'], 2);
            $firstName = $names[0];
            $lastName = $names[1] ?? '';

            // Provide unique default email to satisfy NOT NULL constraint
            $defaultEmail = strtolower($firstName) . '.' . strtolower($lastName) . '.' . time() . '@example.com';

            $trainer = \App\Models\Trainer::firstOrCreate(
                ['first_name' => $firstName, 'last_name' => $lastName],
                ['email' => $defaultEmail, 'is_active' => true]
            );
            $validated['trainer_id'] = $trainer->id;
        }

        // Auto-create city if not exists
        if (isset($validated['city_name'])) {
            $city = \App\Models\City::firstOrCreate(
                ['name' => $validated['city_name']],
                ['is_active' => true]
            );
            $validated['city_id'] = $city->id;
        }

        // Traitement de l'image
        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image
            if ($inPersonTraining->image) {
                Storage::disk('public')->delete($inPersonTraining->image);
            }
            $validated['image'] = $request->file('image')->store('trainings', 'public');
        }

        // Génération du slug si le titre a changé
        if ($validated['title'] !== $inPersonTraining->title) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $inPersonTraining->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Formation mise à jour avec succès',
            'data' => $inPersonTraining->fresh()->load(['category:id,name', 'trainer', 'city:id,name'])
        ]);
    }

    /**
     * Supprimer une formation
     */
    public function destroy(InPersonTraining $inPersonTraining)
    {
        // Vérifier s'il y a des inscriptions
        if ($inPersonTraining->registered_seats > 0) {
            return response()->json([
                'success' => false,
                'message' => "Impossible de supprimer cette formation car elle a {$inPersonTraining->registered_seats} inscription(s)"
            ], 422);
        }

        // Supprimer l'image associée
        if ($inPersonTraining->image) {
            Storage::disk('public')->delete($inPersonTraining->image);
        }

        $inPersonTraining->delete();

        return response()->json([
            'success' => true,
            'message' => 'Formation supprimée avec succès'
        ]);
    }

    /**
     * Basculer le statut actif/inactif
     */
    public function toggleStatus(InPersonTraining $inPersonTraining)
    {
        $inPersonTraining->update(['is_active' => !$inPersonTraining->is_active]);

        return response()->json([
            'success' => true,
            'message' => $inPersonTraining->is_active ? 'Formation activée' : 'Formation désactivée',
            'data' => $inPersonTraining->fresh()
        ]);
    }

    /**
     * Changer le statut de la formation (scheduled, ongoing, completed, cancelled)
     */
    public function updateStatus(Request $request, InPersonTraining $inPersonTraining)
    {
        $request->validate([
            'status' => 'required|in:scheduled,ongoing,completed,cancelled'
        ]);

        $oldStatus = $inPersonTraining->status;
        $inPersonTraining->update(['status' => $request->status]);

        $statusLabels = [
            'scheduled' => 'programmée',
            'ongoing' => 'en cours',
            'completed' => 'terminée',
            'cancelled' => 'annulée'
        ];

        return response()->json([
            'success' => true,
            'message' => "Formation marquée comme {$statusLabels[$request->status]}",
            'data' => $inPersonTraining->fresh()
        ]);
    }
}