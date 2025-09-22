<?php

// app/Models/Trainer.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trainer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'bio',
        'avatar',
        'specializations',
        'rating',
        'total_reviews',
        'is_active'
    ];

    protected $casts = [
        'specializations' => 'array',
        'rating' => 'decimal:2',
        'is_active' => 'boolean'
    ];

    public function trainings()
    {
        return $this->hasMany(Training::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getAvatarUrlAttribute()
    {
        return $this->avatar ? asset('storage/' . $this->avatar) : null;
    }
}
