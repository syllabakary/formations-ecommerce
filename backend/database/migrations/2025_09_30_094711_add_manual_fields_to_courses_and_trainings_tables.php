<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            // Vérifier et ajouter les colonnes manquantes
            if (!Schema::hasColumn('courses', 'trainer_name')) {
                $table->string('trainer_name')->nullable()->after('trainer_id');
            }
            
            if (!Schema::hasColumn('courses', 'access_link')) {
                $table->string('access_link', 500)->nullable()->after('skills');
            }
            
            if (!Schema::hasColumn('courses', 'video_url')) {
                $table->string('video_url', 500)->nullable()->after('access_link');
            }
            
            // Rendre trainer_id nullable s'il ne l'est pas déjà
            $table->unsignedBigInteger('trainer_id')->nullable()->change();
        });

        Schema::table('in_person_trainings', function (Blueprint $table) {
            if (!Schema::hasColumn('in_person_trainings', 'city_name')) {
                $table->string('city_name')->nullable()->after('city_id');
            }
            
            if (!Schema::hasColumn('in_person_trainings', 'trainer_name')) {
                $table->string('trainer_name')->nullable()->after('trainer_id');
            }
            
            // Rendre city_id et trainer_id nullable
            $table->unsignedBigInteger('city_id')->nullable()->change();
            $table->unsignedBigInteger('trainer_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            if (Schema::hasColumn('courses', 'trainer_name')) {
                $table->dropColumn('trainer_name');
            }
            if (Schema::hasColumn('courses', 'access_link')) {
                $table->dropColumn('access_link');
            }
            if (Schema::hasColumn('courses', 'video_url')) {
                $table->dropColumn('video_url');
            }
        });

        Schema::table('in_person_trainings', function (Blueprint $table) {
            if (Schema::hasColumn('in_person_trainings', 'city_name')) {
                $table->dropColumn('city_name');
            }
            if (Schema::hasColumn('in_person_trainings', 'trainer_name')) {
                $table->dropColumn('trainer_name');
            }
        });
    }
};