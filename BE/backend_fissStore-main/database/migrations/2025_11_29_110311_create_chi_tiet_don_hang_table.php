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
        Schema::create('chi_tiet_don_hang', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ma_don_hang');
            $table->unsignedBigInteger('ma_san_pham');
            $table->integer('so_luong');
            $table->decimal('gia_mua', 10, 2);
            $table->timestamps();
            
            $table->foreign('ma_don_hang')->references('ma_don_hang')->on('don_hang')->onDelete('cascade');
            $table->foreign('ma_san_pham')->references('ma_san_pham')->on('san_pham')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chi_tiet_don_hang');
    }
};
