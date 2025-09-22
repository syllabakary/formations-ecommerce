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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['Étudiant', 'Instructeur', 'Admin'])->default('Étudiant')->after('phone');
            $table->enum('status', ['Actif', 'Inactif', 'Suspendu'])->default('Actif')->after('role');
            $table->string('avatar')->nullable()->after('status');
            $table->softDeletes(); // Pour la suppression douce
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'status', 'avatar', 'deleted_at']);
        });
    }
};