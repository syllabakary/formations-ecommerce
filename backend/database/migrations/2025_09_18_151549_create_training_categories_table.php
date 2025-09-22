<?php

// Migration pour les catégories de formation
// database/migrations/create_training_categories_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingCategoriesTable extends Migration
{
    public function up()
    {
        Schema::create('training_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->json('subcategories')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['is_active', 'slug']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('training_categories');
    }
}