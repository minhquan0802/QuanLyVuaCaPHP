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
        Schema::create('san_pham', function (Blueprint $table) {
            $table->id('ma_san_pham');
            $table->unsignedBigInteger('ma_danh_muc');
            $table->string('ten_san_pham', 255);
            $table->text('mo_ta')->nullable();
            $table->decimal('gia_ban', 10, 2);
            $table->string('hinh_anh', 500)->nullable();
            $table->integer('so_luong_ton');
            $table->boolean('hien_thi')->default(true);
            $table->timestamps();
            
            $table->foreign('ma_danh_muc')->references('ma_danh_muc')->on('danh_muc')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('san_pham');
    }
};
