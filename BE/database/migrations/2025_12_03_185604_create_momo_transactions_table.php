<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        // Kiểm tra nếu bảng chưa tồn tại thì mới tạo (tránh lỗi vì bạn đã tạo tay rồi)
        if (!Schema::hasTable('momo_transactions')) {
            Schema::create('momo_transactions', function (Blueprint $table) {
                $table->id();
                $table->string('partner_code');
                $table->string('order_id')->index(); // Index để tìm đơn hàng nhanh hơn
                $table->string('request_id');
                $table->decimal('amount', 15, 0);
                $table->text('order_info');
                $table->string('order_type');
                $table->bigInteger('trans_id')->nullable(); // Dùng BigInt vì transId MoMo rất dài
                $table->integer('result_code');
                $table->string('message');
                $table->string('pay_type');
                $table->bigInteger('response_time');
                $table->text('extra_data')->nullable();
                $table->string('signature');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('momo_transactions');
    }
};
