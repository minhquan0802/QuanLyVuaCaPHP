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
        Schema::table('nguoi_dung', function (Blueprint $table) {
            $table->string('google_id')->nullable()->after('ma_nguoi_dung');
            $table->string('mat_khau')->nullable()->change(); // Cho phép null
        });
    }

    public function down()
    {
        Schema::table('nguoi_dung', function (Blueprint $table) {
            $table->dropColumn('google_id');
            $table->string('mat_khau')->nullable(false)->change();
        });
    }
};
