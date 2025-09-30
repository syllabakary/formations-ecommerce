<?php
// app/Http/Resources/CourseResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'image' => $this->image_url,
            
            // ✅ Category avec fallback
            'category' => $this->when($this->relationLoaded('category'), function () {
                return [
                    'id' => $this->category->id ?? null,
                    'name' => optional($this->category)->name ?? 'Non catégorisé',
                ];
            }, ['id' => $this->category_id, 'name' => 'Non catégorisé']),
            
            // ✅ Trainer avec fallback sur trainer_name
            'trainer' => $this->when(
                $this->relationLoaded('trainer') && $this->trainer,
                function () {
                    return [
                        'id' => $this->trainer->id,
                        'name' => $this->trainer->name,
                    ];
                },
                [
                    'id' => $this->trainer_id ?? null,
                    'name' => $this->trainer_name ?? 'Formateur non spécifié'
                ]
            ),
            
            'trainer_name' => $this->trainer_name ?? (optional($this->trainer)->name ?? 'Non spécifié'),
            
            'type' => $this->type,
            'level' => $this->level,
            'difficulty' => $this->difficulty,
            'price' => $this->price,
            'original_price' => $this->original_price,
            'formatted_price' => $this->formatted_price,
            'formatted_original_price' => $this->formatted_original_price,
            'discount_percentage' => $this->discount_percentage,
            
            'duration_hours' => $this->duration_hours,
            'duration_formatted' => $this->duration_formatted,
            'modules_count' => $this->modules_count,
            'skills' => $this->skills ?? [],
            
            'rating' => (float) $this->rating,
            'total_reviews' => $this->total_reviews,
            'total_students' => $this->total_students,
            
            // ✅ Nouveaux champs
            'access_link' => $this->access_link,
            'video_url' => $this->video_url,
            
            'is_trending' => (bool) $this->is_trending,
            'is_bestseller' => (bool) $this->is_bestseller,
            'is_new' => (bool) $this->is_new,
            'is_active' => (bool) $this->is_active,
            
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}