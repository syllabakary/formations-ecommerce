<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// database/migrations/2024_01_01_000003_create_trainers_table.php

return new class extends Migration
{
    public function up()
    {
        Schema::create('trainers', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->text('bio')->nullable();
            $table->string('avatar')->nullable();
            $table->json('specialties')->nullable(); // ["Web Development", "Data Science"]
            $table->decimal('rating', 2, 1)->default(0);
            $table->integer('total_reviews')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('trainers');
    }
};
