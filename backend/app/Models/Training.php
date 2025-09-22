<?php
// app/Models/Training.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Carbon\Carbon;

class Training extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'short_description',
        'category_id',
        'city_id',
        'trainer_id',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'duration_days',
        'max_seats',
        'available_seats',
        'price',
        'original_price',
        'image',
        'agenda',
        'includes',
        'requirements',
        'rating',
        'total_reviews',
        'is_popular',
        'is_upcoming',
        'is_active',
        'status'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'rating' => 'decimal:2',
        'agenda' => 'array',
        'includes' => 'array',
        'requirements' => 'array',
        'is_popular' => 'boolean',
        'is_upcoming' => 'boolean',
        'is_active' => 'boolean'
    ];

    protected $with = ['category', 'city', 'trainer'];

    // Relations
    public function category()
    {
        return $this->belongsTo(TrainingCategory::class, 'category_id');
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function trainer()
    {
        return $this->belongsTo(Trainer::class);
    }

    public function registrations()
    {
        return $this->hasMany(TrainingRegistration::class);
    }

    // Mutators & Accessors
    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/' . $this->image) : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500';
    }

    public function getFormattedPriceAttribute()
    {
        return number_format($this->price, 0, ',', ' ') . ' F';
    }

    public function getFormattedOriginalPriceAttribute()
    {
        return $this->original_price ? number_format($this->original_price, 0, ',', ' ') . ' F' : null;
    }

    public function getIsFullAttribute()
    {
        return $this->available_seats <= 0;
    }

    public function getRegisteredCountAttribute()
    {
        return $this->max_seats - $this->available_seats;
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->where('status', 'published');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('is_upcoming', true)->where('start_date', '>=', now()->toDateString());
    }

    public function scopePast($query)
    {
        return $query->where('start_date', '<', now()->toDateString());
    }

    public function scopePopular($query)
    {
        return $query->where('is_popular', true);
    }

    public function scopeByCity($query, $cityId)
    {
        return $query->where('city_id', $cityId);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeSearch($query, $searchTerm)
    {
        return $query->where(function ($q) use ($searchTerm) {
            $q->where('title', 'like', '%' . $searchTerm . '%')
              ->orWhere('description', 'like', '%' . $searchTerm . '%')
              ->orWhere('short_description', 'like', '%' . $searchTerm . '%');
        });
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($training) {
            if (empty($training->slug)) {
                $training->slug = Str::slug($training->title);
            }
            
            // Auto-calculate duration
            if ($training->start_date && $training->end_date) {
                $training->duration_days = Carbon::parse($training->start_date)
                    ->diffInDays(Carbon::parse($training->end_date)) + 1;
            }
            
            // Set available seats to max seats initially
            if (empty($training->available_seats)) {
                $training->available_seats = $training->max_seats;
            }
        });

        static::updating(function ($training) {
            // Update upcoming status based on date
            $training->is_upcoming = Carbon::parse($training->start_date)->isFuture();
        });
    }
}