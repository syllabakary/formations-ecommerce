<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// database/migrations/2024_01_01_000004_create_courses_table.php

return new class extends Migration
{
    public function up()
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('short_description');
            $table->longText('description');
            $table->string('image')->nullable();
            $table->enum('type', ['formation', 'certification', 'specialisation']);
            $table->enum('level', ['debutant', 'intermediaire', 'avance']);
            $table->enum('difficulty', ['facile', 'modere', 'difficile']);
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->integer('duration_hours');
            $table->integer('modules_count')->default(0);
            $table->json('skills')->nullable(); // ["PHP", "Laravel", "Vue.js"]
            $table->decimal('rating', 2, 1)->default(0);
            $table->integer('total_reviews')->default(0);
            $table->integer('total_students')->default(0);
            $table->boolean('is_trending')->default(false);
            $table->boolean('is_bestseller')->default(false);
            $table->boolean('is_new')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamp('published_at')->nullable();
            
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('trainer_id')->constrained()->onDelete('cascade');
            
            $table->timestamps();
            
            $table->index(['is_active', 'published_at']);
            $table->index(['category_id', 'is_active']);
            $table->index(['trainer_id', 'is_active']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('courses');
    }
};
