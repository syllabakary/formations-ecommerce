<?php

// app/Models/CourseEnrollment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseEnrollment extends Model
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
        'enrolled_at',
        'progress_percentage',
        'completed_at',
        'certificate_issued',
        'certificate_issued_at',
        'course_id',
    ];

    protected $casts = [
        'amount_paid' => 'decimal:2',
        'enrolled_at' => 'datetime',
        'completed_at' => 'datetime',
        'certificate_issued' => 'boolean',
        'certificate_issued_at' => 'datetime',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function scopeCompleted($query)
    {
        return $query->where('payment_status', 'completed');
    }

    public function scopePending($query)
    {
        return $query->where('payment_status', 'pending');
    }

    public function isCompleted(): bool
    {
        return $this->progress_percentage >= 100;
    }

    public function markAsCompleted(): void
    {
        $this->update([
            'progress_percentage' => 100,
            'completed_at' => now(),
        ]);
    }

    public function issueCertificate(): void
    {
        if ($this->isCompleted() && !$this->certificate_issued) {
            $this->update([
                'certificate_issued' => true,
                'certificate_issued_at' => now(),
            ]);
        }
    }
}