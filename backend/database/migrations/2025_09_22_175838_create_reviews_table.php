<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
// database/migrations/2024_01_01_000008_create_reviews_table.php

return new class extends Migration
{
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->string('reviewer_name');
            $table->string('reviewer_email');
            $table->integer('rating'); // 1-5
            $table->text('comment')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_approved')->default(false);
            $table->timestamp('reviewed_at');
            
            // Polymorphic relationship - can review courses or trainings
            $table->morphs('reviewable');
            
            $table->timestamps();
            
            $table->index(['reviewable_type', 'reviewable_id', 'is_approved']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('reviews');
    }
};
