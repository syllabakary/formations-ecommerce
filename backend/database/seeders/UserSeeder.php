<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::updateOrCreate(
            ['email' => 'admin@formationpro.com'],
            [
                'name' => 'Admin User',
                'phone' => '+1234567890',
                'password' => Hash::make('password'),
                'role' => 'Admin',
                'status' => 'Actif',
                'email_verified_at' => Carbon::now(),
                'is_verified' => true,
                'otp' => null,
                'otp_expires_at' => null,
            ]
        );

        // Create instructor user
        User::updateOrCreate(
            ['email' => 'instructor@formationpro.com'],
            [
                'name' => 'Instructor User',
                'phone' => '+1234567891',
                'password' => Hash::make('password'),
                'role' => 'Instructeur',
                'status' => 'Actif',
                'email_verified_at' => Carbon::now(),
                'is_verified' => true,
                'otp' => null,
                'otp_expires_at' => null,
            ]
        );

        // Create student user
        User::updateOrCreate(
            ['email' => 'student@formationpro.com'],
            [
                'name' => 'Student User',
                'phone' => '+1234567892',
                'password' => Hash::make('password'),
                'role' => 'Étudiant',
                'status' => 'Actif',
                'email_verified_at' => Carbon::now(),
                'is_verified' => true,
                'otp' => null,
                'otp_expires_at' => null,
            ]
        );
    }
}
