<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
// database/migrations/2024_01_01_000006_create_course_enrollments_table.php

return new class extends Migration
{
    public function up()
    {
        Schema::create('course_enrollments', function (Blueprint $table) {
            $table->id();
            $table->string('participant_name');
            $table->string('participant_email');
            $table->string('participant_phone');
            $table->string('company')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('amount_paid', 10, 2);
            $table->enum('payment_status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
            $table->string('payment_method')->nullable();
            $table->string('transaction_id')->nullable();
            $table->timestamp('enrolled_at');
            $table->integer('progress_percentage')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->boolean('certificate_issued')->default(false);
            $table->timestamp('certificate_issued_at')->nullable();
            
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            
            $table->timestamps();
            
            $table->index(['course_id', 'payment_status']);
            $table->index(['participant_email']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('course_enrollments');
    }
};