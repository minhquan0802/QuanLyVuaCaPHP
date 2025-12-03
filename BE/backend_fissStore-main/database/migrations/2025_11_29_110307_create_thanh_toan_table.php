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
        Schema::create('thanh_toan', function (Blueprint $table) {
            $table->id('ma_thanh_toan');
            $table->unsignedBigInteger('ma_don_hang');
            $table->enum('phuong_thuc', ['cash', 'credit_card', 'bank_transfer', 'e_wallet']);
            $table->enum('trang_thai', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
            $table->dateTime('ngai_thanh_toan')->nullable();
            $table->decimal('so_tien', 10, 2);
            $table->text('noi_dung')->nullable();
            $table->string('ma_giao_dich', 100)->nullable();
            $table->string('ma_loi', 50)->nullable();
            $table->string('thong_bao_loi', 255)->nullable();
            $table->timestamps();
            
            $table->foreign('ma_don_hang')->references('ma_don_hang')->on('don_hang')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('thanh_toan');
    }
};
