<?php
// app/Http/Resources/TrainingResource.php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TrainingResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'category' => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug
            ],
            'city' => [
                'id' => $this->city->id,
                'name' => $this->city->name
            ],
            'trainer' => [
                'id' => $this->trainer->id,
                'name' => $this->trainer->name,
                'bio' => $this->trainer->bio,
                'rating' => $this->trainer->rating,
                'avatar_url' => $this->trainer->avatar_url
            ],
            'start_date' => $this->start_date->format('Y-m-d'),
            'end_date' => $this->end_date->format('Y-m-d'),
            'start_time' => $this->start_time?->format('H:i'),
            'end_time' => $this->end_time?->format('H:i'),
            'duration_days' => $this->duration_days,
            'max_seats' => $this->max_seats,
            'available_seats' => $this->available_seats,
            'registered_count' => $this->registered_count,
            'price' => $this->price,
            'original_price' => $this->original_price,
            'formatted_price' => $this->formatted_price,
            'formatted_original_price' => $this->formatted_original_price,
            'image_url' => $this->image_url,
            'rating' => $this->rating,
            'total_reviews' => $this->total_reviews,
            'is_popular' => $this->is_popular,
            'is_upcoming' => $this->is_upcoming,
            'is_full' => $this->is_full,
            'status' => $this->status,
            'formatted_date' => $this->start_date->translatedFormat('l j F Y'),
            'created_at' => $this->created_at
        ];
    }
}