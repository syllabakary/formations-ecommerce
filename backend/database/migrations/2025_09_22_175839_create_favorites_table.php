<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// database/migrations/2024_01_01_000009_create_favorites_table.php

return new class extends Migration
{
    public function up()
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->string('user_email'); // Simplified user identification
            $table->string('user_name')->nullable();
            
            // Polymorphic relationship - can favorite courses or trainings
            $table->morphs('favoritable');
            
            $table->timestamps();
            
            $table->unique(['user_email', 'favoritable_type', 'favoritable_id'], 'unique_user_favorite');
        });
    }

    public function down()
    {
        Schema::dropIfExists('favorites');
    }
};
