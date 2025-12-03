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
        Schema::create('don_hang', function (Blueprint $table) {
            $table->id('ma_don_hang');
            $table->unsignedBigInteger('ma_nguoi_dung');
            $table->dateTime('ngay_dat');
            $table->decimal('tong_tien', 10, 2);
            $table->enum('trang_thai', ['pending', 'processing', 'completed', 'cancelled'])->default('pending');
            $table->text('dia_chi_giao_hang');
            $table->text('ghi_chu')->nullable();
            $table->timestamps();
            
            $table->foreign('ma_nguoi_dung')->references('ma_nguoi_dung')->on('nguoi_dung')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('don_hang');
    }
};
