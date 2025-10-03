<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// database/migrations/2024_01_01_000007_create_training_registrations_table.php

return new class extends Migration
{
    public function up()
    {
        Schema::create('training_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('participant_name');
            $table->string('participant_email');
            $table->string('participant_phone');
            $table->string('company')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('amount_paid', 10, 2);
            $table->enum('payment_status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
            $table->string('payment_method')->nullable();
            $table->string('transaction_id')->nullable();
            $table->timestamp('registered_at');
            $table->enum('attendance_status', ['registered', 'attended', 'absent', 'cancelled'])->default('registered');
            $table->timestamp('attended_at')->nullable();
            $table->boolean('certificate_issued')->default(false);
            $table->timestamp('certificate_issued_at')->nullable();
            
            $table->foreignId('in_person_training_id')->constrained()->onDelete('cascade');
            
            $table->timestamps();
            
            // Contraintes et index
            $table->unique(['in_person_training_id', 'participant_email'], 'unique_training_participant');
            $table->index(['in_person_training_id', 'payment_status'], 'tr_reg_training_payment_idx');
        });
    }

    public function down()
    {
        Schema::dropIfExists('training_registrations');
    }
};
