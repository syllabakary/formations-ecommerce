<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role,
            'status' => $this->status,
            'avatar' => $this->avatar,
            'email_verified_at' => $this->email_verified_at,
            'join_date' => $this->join_date,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Statistiques dynamiques pour l'interface
            'courses_enrolled' => $this->when($this->role === 'Étudiant', rand(0, 5)),
            'courses_completed' => $this->when($this->role === 'Étudiant', rand(0, 3)),
            'courses_created' => $this->when($this->role === 'Instructeur', rand(0, 3)),
            'last_active' => $this->getRandomLastActive(),
            
            // Flags utiles
            'is_admin' => $this->isAdmin(),
            'is_active' => $this->isActive(),
            'is_verified' => $this->isEmailVerified(),
        ];
    }

    /**
     * Générer une activité récente aléatoire
     */
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