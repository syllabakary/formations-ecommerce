<?php
// app/Models/TrainingRegistration.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainingRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'participant_name',
        'participant_email',
        'participant_phone',
        'company',
        'notes',
        'amount_paid',
        'payment_status',
        'payment_method',
        'transaction_id',
        'registered_at',
        'attendance_status',
        'attended_at',
        'certificate_issued',
        'certificate_issued_at',
        'in_person_training_id',
    ];

    protected $casts = [
        'amount_paid' => 'decimal:2',
        'registered_at' => 'datetime',
        'attended_at' => 'datetime',
        'certificate_issued' => 'boolean',
        'certificate_issued_at' => 'datetime',
    ];

    public function inPersonTraining(): BelongsTo
    {
        return $this->belongsTo(InPersonTraining::class);
    }

    public function scopeCompleted($query)
    {
        return $query->where('payment_status', 'completed');
    }

    public function scopeAttended($query)
    {
        return $query->where('attendance_status', 'attended');
    }

    public function markAttended(): void
    {
        $this->update([
            'attendance_status' => 'attended',
            'attended_at' => now(),
        ]);
    }

    public function issueCertificate(): void
    {
        if ($this->attendance_status === 'attended' && !$this->certificate_issued) {
            $this->update([
                'certificate_issued' => true,
                'certificate_issued_at' => now(),
            ]);
        }
    }
}
