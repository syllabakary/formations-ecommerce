<?php

// app/Models/Favorite.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Favorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_email',
        'user_name',
        'favoritable_type',
        'favoritable_id',
    ];

    public function favoritable(): MorphTo
    {
        return $this->morphTo();
    }

    public function scopeByUser($query, $email)
    {
        return $query->where('user_email', $email);
    }
}