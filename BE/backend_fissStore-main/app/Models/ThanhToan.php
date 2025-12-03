<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThanhToan extends Model
{
    protected $table = 'thanh_toan';
    protected $primaryKey = 'ma_thanh_toan';
    
    protected $fillable = [
        'ma_don_hang',
        'phuong_thuc',
        'trang_thai',
        'ngai_thanh_toan',
        'so_tien',
        'noi_dung',
        'ma_giao_dich',
        'ma_loi',
        'thong_bao_loi',
    ];

    protected $casts = [
        'ngai_thanh_toan' => 'datetime',
        'so_tien' => 'decimal:2',
    ];

    public function donHang()
    {
        return $this->belongsTo(DonHang::class, 'ma_don_hang', 'ma_don_hang');
    }
}
