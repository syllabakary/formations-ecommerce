<?php
// database/migrations/XXXX_XX_XX_add_manual_fields_to_courses_table.php

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
        Schema::table('courses', function (Blueprint $table) {
            // Rendre trainer_id nullable et ajouter trainer_name
            $table->string('trainer_name')->nullable()->after('trainer_id');
            $table->unsignedBigInteger('trainer_id')->nullable()->change();
            
            // Ajouter les champs pour liens d'accès
            $table->string('access_link')->nullable()->after('skills');
            $table->string('video_url')->nullable()->after('access_link');
        });

        Schema::table('in_person_trainings', function (Blueprint $table) {
            // Rendre city_id nullable et ajouter city_name
            $table->string('city_name')->nullable()->after('city_id');
            $table->unsignedBigInteger('city_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['trainer_name', 'access_link', 'video_url']);
        });

        Schema::table('in_person_trainings', function (Blueprint $table) {
            $table->dropColumn('city_name');
        });
    }
};