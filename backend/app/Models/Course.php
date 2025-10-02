<?php
// app/Models/Course.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'description',
        'image',
        'type',
        'level',
        'difficulty',
        'price',
        'original_price',
        'duration_hours',
        'modules_count',
        'skills',
        'rating',
        'total_reviews',
        'total_students',
        'is_trending',
        'is_bestseller',
        'is_new',
        'is_active',
        'published_at',
        'category_id',
        'trainer_id',
        'trainer_name',
        'access_link',
        'video_url',
    ];

    protected $casts = [
        'skills' => 'array',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'rating' => 'decimal:1',
        'is_trending' => 'boolean',
        'is_bestseller' => 'boolean',
        'is_new' => 'boolean',
        'is_active' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected $appends = [
        'formatted_price',
        'formatted_original_price',
        'discount_percentage',
        'duration_formatted',
        'image_url',
        'available_seats',
        'is_full',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }

    public function modules(): HasMany
    {
        return $this->hasMany(CourseModule::class)->orderBy('sort_order');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(CourseEnrollment::class);
    }

    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    public function favorites(): MorphMany
    {
        return $this->morphMany(Favorite::class, 'favoritable');
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

    public function getDiscountPercentageAttribute(): ?int
    {
        if (!$this->original_price || $this->original_price <= $this->price) {
            return null;
        }
        
        return (int) round((($this->original_price - $this->price) / $this->original_price) * 100);
    }

    public function getDurationFormattedAttribute(): string
    {
        return $this->duration_hours . 'h';
    }

    public function getImageUrlAttribute(): string
    {
        return $this->image 
            ? asset('storage/' . $this->image)
            : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=crop';
    }

    public function getAvailableSeatsAttribute(): int
    {
        return 999; // Unlimited for online courses
    }

    public function getIsFullAttribute(): bool
    {
        return false; // Never full for online courses
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->whereNotNull('published_at');
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeByLevel($query, $level)
    {
        return $query->where('level', $level);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeSearch($query, $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('title', 'LIKE', "%{$term}%")
              ->orWhere('short_description', 'LIKE', "%{$term}%")
              ->orWhere('description', 'LIKE', "%{$term}%")
              ->orWhere('skills', 'LIKE', "%{$term}%");
        });
    }

    public function scopePopular($query)
    {
        return $query->orderBy('total_students', 'desc');
    }

    public function scopeHighestRated($query)
    {
        return $query->orderBy('rating', 'desc');
    }

    public function scopePriceAsc($query)
    {
        return $query->orderBy('price', 'asc');
    }

    public function scopePriceDesc($query)
    {
        return $query->orderBy('price', 'desc');
    }

    public function scopeNewest($query)
    {
        return $query->orderBy('published_at', 'desc');
    }

    // Methods
    public function updateStats(): void
    {
        $reviews = $this->reviews()->where('is_approved', true)->get();
        $enrollments = $this->enrollments()->where('payment_status', 'completed')->count();
        
        $this->update([
            'rating' => $reviews->count() > 0 ? $reviews->avg('rating') : 0,
            'total_reviews' => $reviews->count(),
            'total_students' => $enrollments,
            'modules_count' => $this->modules()->count(),
        ]);
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($course) {
            if (!$course->slug) {
                $course->slug = Str::slug($course->title);
            }
        });
    }
}
