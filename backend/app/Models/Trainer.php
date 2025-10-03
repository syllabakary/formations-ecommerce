<?php

// app/Models/Trainer.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Trainer extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'bio',
        'avatar',
        'specialties',
        'rating',
        'total_reviews',
        'is_active',
    ];

    protected $casts = [
        'specialties' => 'array',
        'rating' => 'decimal:1',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'name',
        'initials',
    ];

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    public function inPersonTrainings(): HasMany
    {
        return $this->hasMany(InPersonTraining::class);
    }

    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    public function getNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    public function getInitialsAttribute(): string
    {
        return strtoupper(substr($this->first_name, 0, 1) . substr($this->last_name, 0, 1));
    }

    public function getAvatarUrlAttribute(): string
    {
        return $this->avatar 
            ? asset('storage/' . $this->avatar)
            : 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&background=6366f1&color=ffffff';
    }

    public function updateRating(): void
    {
        $reviews = $this->reviews()->where('is_approved', true)->get();
        
        if ($reviews->count() > 0) {
            $this->update([
                'rating' => $reviews->avg('rating'),
                'total_reviews' => $reviews->count(),
            ]);
        }
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
