<?php
// app/Models/InPersonTraining.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class InPersonTraining extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'description',
        'image',
        'price',
        'original_price',
        'duration_days',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'venue_name',
        'venue_address',
        'max_seats',
        'registered_seats',
        'status',
        'registration_deadline',
        'is_popular',
        'is_active',
        'category_id',
        'city_id',
        'city_name',    // ✅ AJOUTÉ - Saisie manuelle du lieu
        'trainer_id',
        'trainer_name', // ✅ AJOUTÉ - Saisie manuelle du formateur
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'registration_deadline' => 'date',
        'is_popular' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'formatted_price',
        'formatted_original_price',
        'available_seats',
        'is_full',
        'discount_percentage',
    ];

    // Relations optionnelles
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }

    // Accessors
    public function getFormattedPriceAttribute(): string
    {
        return number_format($this->price, 0, ',', ' ') . ' F';
    }

    public function getFormattedOriginalPriceAttribute(): ?string
    {
        return $this->original_price 
            ? number_format($this->original_price, 0, ',', ' ') . ' F'
            : null;
    }

    public function getAvailableSeatsAttribute(): int
    {
        return max(0, $this->max_seats - $this->registered_seats);
    }

    public function getIsFullAttribute(): bool
    {
        return $this->registered_seats >= $this->max_seats;
    }

    public function getDiscountPercentageAttribute(): ?int
    {
        if (!$this->original_price || $this->original_price <= $this->price) {
            return null;
        }
        
        return (int) round((($this->original_price - $this->price) / $this->original_price) * 100);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_date', '>=', now())->where('status', 'scheduled');
    }

    public function scopeSearch($query, $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('title', 'LIKE', "%{$term}%")
              ->orWhere('description', 'LIKE', "%{$term}%")
              ->orWhere('venue_name', 'LIKE', "%{$term}%")
              ->orWhere('city_name', 'LIKE', "%{$term}%")  // ✅ Recherche par ville
              ->orWhere('trainer_name', 'LIKE', "%{$term}%"); // ✅ Recherche par formateur
        });
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($training) {
            if (!$training->slug) {
                $training->slug = Str::slug($training->title);
            }
        });
    }
}