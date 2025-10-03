<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add trainer_name to courses table and make trainer_id nullable
        Schema::table('courses', function (Blueprint $table) {
            if (!Schema::hasColumn('courses', 'trainer_name')) {
                $table->string('trainer_name')->after('trainer_id')->nullable();
            }
            $table->dropForeign(['trainer_id']);
            $table->foreignId('trainer_id')->nullable()->change()->constrained()->onDelete('set null');
        });

        // Add trainer_name to in_person_trainings table and make trainer_id nullable
        Schema::table('in_person_trainings', function (Blueprint $table) {
            if (!Schema::hasColumn('in_person_trainings', 'trainer_name')) {
                $table->string('trainer_name')->after('trainer_id')->nullable();
            }
            $table->dropForeign(['trainer_id']);
            $table->foreignId('trainer_id')->nullable()->change()->constrained()->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove trainer_name from courses table and make trainer_id not nullable
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn('trainer_name');
            $table->dropForeign(['trainer_id']);
            $table->foreignId('trainer_id')->change()->constrained()->onDelete('cascade');
        });

        // Remove trainer_name from in_person_trainings table and make trainer_id not nullable
        Schema::table('in_person_trainings', function (Blueprint $table) {
            $table->dropColumn('trainer_name');
            $table->dropForeign(['trainer_id']);
            $table->foreignId('trainer_id')->change()->constrained()->onDelete('cascade');
        });
    }
};
