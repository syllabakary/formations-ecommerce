<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Vérifie si la table n’existe pas déjà
        if (!Schema::hasTable('training_registrations')) {
            Schema::create('training_registrations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('training_id')
                      ->constrained('trainings') // clé étrangère vers la table trainings
                      ->onDelete('cascade');
                
                $table->string('participant_name');
                $table->string('participant_email');
                $table->string('participant_phone');
                $table->string('company')->nullable();
                $table->text('notes')->nullable();

                $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])
                      ->default('pending');
                $table->decimal('amount_paid', 10, 2)->default(0);

                $table->timestamp('registered_at')->useCurrent();

                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_registrations');
    }
};
