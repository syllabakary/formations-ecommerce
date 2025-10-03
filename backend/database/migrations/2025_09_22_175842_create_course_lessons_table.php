<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// database/migrations/2024_01_01_000011_create_course_lessons_table.php

return new class extends Migration
{
    public function up()
    {
        Schema::create('course_lessons', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['video', 'text', 'quiz', 'assignment']);
            $table->string('video_url')->nullable();
            $table->longText('content')->nullable();
            $table->integer('duration_minutes')->default(0);
            $table->integer('sort_order');
            $table->boolean('is_preview')->default(false);
            $table->boolean('is_active')->default(true);
            
            $table->foreignId('course_module_id')->constrained()->onDelete('cascade');
            
            $table->timestamps();
            
            $table->index(['course_module_id', 'sort_order']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('course_lessons');
    }
};