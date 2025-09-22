<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'status',
        'avatar',
        'email_verified_at',
        'otp',
        'otp_expires_at',
        'is_verified',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
        'otp_expires_at' => 'datetime',
        'is_verified' => 'boolean',
    ];

    /**
     * Les rôles disponibles
     */
    const ROLES = [
        'Étudiant',
        'Instructeur', 
        'Admin'
    ];

    /**
     * Les statuts disponibles
     */
    const STATUSES = [
        'Actif',
        'Inactif',
        'Suspendu'
    ];

    /**
     * Vérifier si l'utilisateur est un administrateur
     */
    public function isAdmin(): bool
    {
        return $this->role === 'Admin';
    }

    /**
     * Vérifier si l'utilisateur est un instructeur
     */
    public function isInstructor(): bool
    {
        return $this->role === 'Instructeur';
    }

    /**
     * Vérifier si l'utilisateur est un étudiant
     */
    public function isStudent(): bool
    {
        return $this->role === 'Étudiant';
    }

    /**
     * Vérifier si le compte est actif
     */
    public function isActive(): bool
    {
        return $this->status === 'Actif';
    }

    /**
     * Vérifier si le compte est suspendu
     */
    public function isSuspended(): bool
    {
        return $this->status === 'Suspendu';
    }

    /**
     * Vérifier si l'email est vérifié
     */
    public function isEmailVerified(): bool
    {
        return !is_null($this->email_verified_at);
    }

    /**
     * Marquer l'email comme vérifié
     */
    public function markEmailAsVerified(): bool
    {
        return $this->forceFill([
            'email_verified_at' => $this->freshTimestamp(),
        ])->save();
    }

    /**
     * Obtenir l'avatar avec une URL par défaut
     */
    public function getAvatarAttribute($value): string
    {
        return $value ?: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150';
    }

    /**
     * Scope pour filtrer par rôle
     */
    public function scopeByRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Scope pour filtrer par statut
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope pour les utilisateurs actifs
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'Actif');
    }

    /**
     * Scope pour les utilisateurs vérifiés
     */
    public function scopeVerified($query)
    {
        return $query->whereNotNull('email_verified_at');
    }

    /**
     * Scope pour recherche
     */
    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name', 'LIKE', "%{$term}%")
              ->orWhere('email', 'LIKE', "%{$term}%");
        });
    }

    /**
     * Relation avec les OTP
     */
    public function otps()
    {
        return $this->hasMany(Otp::class, 'email', 'email');
    }

    /**
     * Accesseur pour formater la date de création
     */
    public function getJoinDateAttribute(): string
    {
        return $this->created_at->format('Y-m-d');
    }

    /**
     * Accesseur pour le nom complet formaté
     */
    public function getFormattedNameAttribute(): string
    {
        return ucwords(strtolower($this->name));
    }

    /**
     * Mutateur pour le rôle - validation
     */
    public function setRoleAttribute($value): void
    {
        if (!in_array($value, self::ROLES)) {
            throw new \InvalidArgumentException("Rôle invalide: {$value}");
        }
        $this->attributes['role'] = $value;
    }

    /**
     * Mutateur pour le statut - validation
     */
    public function setStatusAttribute($value): void
    {
        if (!in_array($value, self::STATUSES)) {
            throw new \InvalidArgumentException("Statut invalide: {$value}");
        }
        $this->attributes['status'] = $value;
    }

    /**
     * Boot method pour définir les valeurs par défaut
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (!$user->role) {
                $user->role = 'Étudiant';
            }
            if (!$user->status) {
                $user->status = 'Actif';
            }
            if (!$user->avatar) {
                $user->avatar = 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150';
            }
        });
    }
}