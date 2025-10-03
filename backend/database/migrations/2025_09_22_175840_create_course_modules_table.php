<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// database/migrations/2024_01_01_000010_create_course_modules_table.php

return new class extends Migration
{
    public function up()
    {
        Schema::create('course_modules', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('duration_minutes');
            $table->integer('sort_order');
            $table->boolean('is_preview')->default(false);
            $table->boolean('is_active')->default(true);
            
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            
            $table->timestamps();
            
            $table->index(['course_id', 'sort_order']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('course_modules');
    }
};