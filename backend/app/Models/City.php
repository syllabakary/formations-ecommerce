<?php

// app/Models/City.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class City extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'country',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function trainings()
    {
        return $this->hasMany(Training::class);
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($city) {
            if (empty($city->slug)) {
                $city->slug = Str::slug($city->name);
            }
        });
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
