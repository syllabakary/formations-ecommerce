<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingsTable extends Migration
{
    public function up()
    {
        Schema::create('trainings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('short_description');
            $table->foreignId('category_id')->constrained('training_categories');
            $table->foreignId('city_id')->constrained('cities');
            $table->foreignId('trainer_id')->constrained('trainers');
            $table->date('start_date');
            $table->date('end_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('duration_days');
            $table->integer('max_seats');
            $table->integer('available_seats');
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->string('image')->nullable();
            $table->json('agenda')->nullable();
            $table->json('includes')->nullable();
            $table->json('requirements')->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('total_reviews')->default(0);
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_upcoming')->default(true);
            $table->boolean('is_active')->default(true);
            $table->enum('status', ['draft', 'published', 'cancelled', 'completed'])->default('published');
            $table->timestamps();
            
            $table->index(['is_active', 'status', 'is_upcoming']);
            $table->index(['start_date', 'city_id']);
            $table->index(['category_id', 'is_popular']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('trainings');
    }
}
