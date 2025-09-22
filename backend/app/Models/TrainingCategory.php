<?php

/ app/Models/TrainingCategory.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TrainingCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'subcategories',
        'is_active'
    ];

    protected $casts = [
        'subcategories' => 'array',
        'is_active' => 'boolean'
    ];

    public function trainings()
    {
        return $this->hasMany(Training::class, 'category_id');
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
