<?php
// app/Models/Category.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'color',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    public function onlineCourses(): HasMany
    {
        return $this->courses();
    }

    public function inPersonTrainings(): HasMany
    {
        return $this->hasMany(InPersonTraining::class);
    }

    public function getCoursesCountAttribute(): int
    {
        return $this->courses()->where('is_active', true)->count();
    }

    public function getTrainingsCountAttribute(): int
    {
        return $this->inPersonTrainings()->where('is_active', true)->count();
    }

    public function getTotalCountAttribute(): int
    {
        return $this->courses_count + $this->trainings_count;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }
}