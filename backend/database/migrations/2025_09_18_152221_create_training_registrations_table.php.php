<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// database/migrations/create_training_registrations_table.php
class CreateTrainingRegistrationsTable extends Migration
{
    public function up()
    {
        Schema::create('training_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_id')->constrained('trainings');
            $table->string('participant_name');
            $table->string('participant_email');
            $table->string('participant_phone');
            $table->string('company')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->decimal('amount_paid', 10, 2)->default(0);
            $table->timestamp('registered_at')->useCurrent();
            $table->timestamps();
            
            $table->index(['training_id', 'status']);
            $table->unique(['training_id', 'participant_email']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('training_registrations');
    }
}