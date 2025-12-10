<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MomoTransaction extends Model
{
    use HasFactory;

    // 1. Khai báo tên bảng (vì mình tạo tay nên khai báo cho chắc)
    protected $table = 'momo_transactions';

    // 2. Khai báo các cột được phép lưu (Mass Assignment)
    protected $fillable = [
        'partner_code',
        'order_id',
        'request_id',
        'amount',
        'order_info',
        'order_type',
        'trans_id',
        'result_code',
        'message',
        'pay_type',
        'response_time',
        'extra_data',
        'signature',
    ];
    
    // 3. Tự động quản lý created_at, updated_at
    public $timestamps = true;
}