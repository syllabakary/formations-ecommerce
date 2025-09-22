<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('trainings')) {
            Schema::create('trainings', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('slug')->unique();
                $table->text('description');
                $table->text('short_description')->nullable();
                $table->foreignId('category_id')->constrained('training_categories')->onDelete('cascade');
                $table->foreignId('city_id')->constrained('cities')->onDelete('cascade');
                $table->foreignId('trainer_id')->constrained('trainers')->onDelete('cascade');
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
                $table->boolean('is_upcoming')->default(false);
                $table->boolean('is_active')->default(true);
                $table->enum('status', ['draft', 'published', 'cancelled', 'completed'])->default('draft');
                $table->timestamps();

                $table->index(['start_date', 'is_active']);
                $table->index(['category_id', 'is_active']);
                $table->index(['city_id', 'is_active']);
                $table->index('is_popular');
                $table->index('is_upcoming');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('trainings');
    }
};
