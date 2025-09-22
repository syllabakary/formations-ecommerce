<?php
// Modèle TrainingRegistration
// app/Models/TrainingRegistration.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'training_id',
        'participant_name',
        'participant_email',
        'participant_phone',
        'company',
        'notes',
        'status',
        'amount_paid',
        'registered_at'
    ];

    protected $casts = [
        'amount_paid' => 'decimal:2',
        'registered_at' => 'datetime'
    ];

    public function training()
    {
        return $this->belongsTo(Training::class);
    }

    protected static function boot()
    {
        parent::boot();
        
        static::created(function ($registration) {
            // Decrease available seats when registration is confirmed
            if ($registration->status === 'confirmed') {
                $registration->training()->decrement('available_seats');
            }
        });

        static::updated(function ($registration) {
            if ($registration->isDirty('status')) {
                $training = $registration->training;
                
                if ($registration->status === 'confirmed' && $registration->getOriginal('status') !== 'confirmed') {
                    $training->decrement('available_seats');
                } elseif ($registration->getOriginal('status') === 'confirmed' && $registration->status !== 'confirmed') {
                    $training->increment('available_seats');
                }
            }
        });
    }
}