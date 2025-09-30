<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
       Schema::create('user_formations', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('phone')->nullable();
    $table->string('password');
    $table->enum('role', ['super_admin', 'formateur', 'apprenant'])->default('apprenant'); 
    $table->string('otp')->nullable();
    $table->timestamp('otp_expires_at')->nullable();
    $table->rememberToken();
    $table->timestamps();
});

    }

    public function down(): void
    {
        Schema::dropIfExists('user_formations');
    }
};
