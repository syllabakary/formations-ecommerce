<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// database/migrations/2024_01_01_000005_create_in_person_trainings_table.php

return new class extends Migration
{
    public function up()
    {
        Schema::create('in_person_trainings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('short_description');
            $table->longText('description');
            $table->string('image')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->integer('duration_days');
            $table->date('start_date');
            $table->date('end_date');
            $table->time('start_time')->default('09:00:00');
            $table->time('end_time')->default('17:00:00');
            $table->string('venue_name')->nullable();
            $table->text('venue_address')->nullable();
            $table->integer('max_seats');
            $table->integer('registered_seats')->default(0);
            $table->decimal('rating', 2, 1)->default(0);
            $table->integer('total_reviews')->default(0);
            $table->boolean('is_popular')->default(false);
            $table->enum('status', ['scheduled', 'ongoing', 'completed', 'cancelled'])->default('scheduled');
            $table->boolean('is_active')->default(true);
            $table->timestamp('registration_deadline')->nullable();
            
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('city_id')->constrained()->onDelete('cascade');
            $table->foreignId('trainer_id')->constrained()->onDelete('cascade');
            
            $table->timestamps();
            
            $table->index(['status', 'start_date']);
            $table->index(['city_id', 'status']);
            $table->index(['category_id', 'status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('in_person_trainings');
    }
};

