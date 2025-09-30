<?php
// app/Http/Resources/TrainingDetailResource.php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TrainingDetailResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'category' => [
                'id' => optional($this->category)->id,
                'name' => optional($this->category)->name ?? '',
                'slug' => optional($this->category)->slug ?? '',
                'subcategories' => optional($this->category)->subcategories ?? []
            ],
            'city' => [
                'id' => optional($this->city)->id,
                'name' => optional($this->city)->name ?? '',
                'country' => optional($this->city)->country ?? ''
            ],
            'trainer' => $this->when(
                $this->relationLoaded('trainer') && $this->trainer,
                function () {
                    return [
                        'id' => $this->trainer->id,
                        'name' => $this->trainer->name,
                        'bio' => $this->trainer->bio,
                        'rating' => $this->trainer->rating,
                        'total_reviews' => $this->trainer->total_reviews,
                        'avatar_url' => $this->trainer->avatar_url,
                        'specializations' => $this->trainer->specializations
                    ];
                },
                [
                    'id' => $this->trainer_id ?? null,
                    'name' => $this->trainer_name ?? 'Formateur non spécifié'
                ]
            ),
            'schedule' => [
                'start_date' => $this->start_date->format('Y-m-d'),
                'end_date' => $this->end_date->format('Y-m-d'),
                'start_time' => $this->start_time?->format('H:i'),
                'end_time' => $this->end_time?->format('H:i'),
                'duration_days' => $this->duration_days,
                'formatted_date' => $this->start_date->translatedFormat('l j F Y')
            ],
            'seats' => [
                'max_seats' => $this->max_seats,
                'available_seats' => $this->available_seats,
                'registered_count' => $this->registered_count,
                'is_full' => $this->is_full
            ],
            'pricing' => [
                'price' => $this->price,
                'original_price' => $this->original_price,
                'formatted_price' => $this->formatted_price,
                'formatted_original_price' => $this->formatted_original_price,
                'has_discount' => $this->original_price > $this->price
            ],
            'content' => [
                'image_url' => $this->image_url,
                'agenda' => $this->agenda,
                'includes' => $this->includes,
                'requirements' => $this->requirements
            ],
            'ratings' => [
                'rating' => $this->rating,
                'total_reviews' => $this->total_reviews
            ],
            'flags' => [
                'is_popular' => $this->is_popular,
                'is_upcoming' => $this->is_upcoming,
                'is_full' => $this->is_full,
                'is_active' => $this->is_active
            ],
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}