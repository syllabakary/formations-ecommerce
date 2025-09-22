<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Otp extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'code',
        'expires_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expires_at' => 'datetime',
    ];

    /**
     * Vérifier si l'OTP est expiré
     */
    public function isExpired(): bool
    {
        return $this->expires_at < Carbon::now();
    }

    /**
     * Scope pour récupérer les OTP valides (non expirés)
     */
    public function scopeValid($query)
    {
        return $query->where('expires_at', '>', Carbon::now());
    }

    /**
     * Scope pour récupérer les OTP expirés
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<', Carbon::now());
    }
}
