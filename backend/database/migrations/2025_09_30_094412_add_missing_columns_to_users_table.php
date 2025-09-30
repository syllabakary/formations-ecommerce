<?php
// database/migrations/2025_09_22_121043_add_role_status_avatar_to_users_table.php

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
            // Vérifier et ajouter uniquement les colonnes manquantes
            
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['Étudiant', 'Instructeur', 'Admin'])
                      ->default('Étudiant')
                      ->after('email');
            }
            
            if (!Schema::hasColumn('users', 'status')) {
                $table->enum('status', ['Actif', 'Inactif', 'Suspendu'])
                      ->default('Actif')
                      ->after('role');
            }
            
            if (!Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar')->nullable()->after('status');
            }
            
            if (!Schema::hasColumn('users', 'otp')) {
                $table->string('otp', 6)->nullable()->after('password');
            }
            
            if (!Schema::hasColumn('users', 'otp_expires_at')) {
                $table->timestamp('otp_expires_at')->nullable()->after('otp');
            }
            
            if (!Schema::hasColumn('users', 'is_verified')) {
                $table->boolean('is_verified')->default(false)->after('otp_expires_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = ['role', 'status', 'avatar', 'otp', 'otp_expires_at', 'is_verified'];
            
            foreach ($columns as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};