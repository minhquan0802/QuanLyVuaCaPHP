<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SanPham extends Model
{
    protected $table = 'san_pham';
    protected $primaryKey = 'ma_san_pham';
    
    protected $fillable = [
        'ma_danh_muc',
        'ten_san_pham',
        'mo_ta',
        'gia_ban',
        'hinh_anh',
        'so_luong_ton',
        'hien_thi',
    ];

    protected $casts = [
        'gia_ban' => 'decimal:2',
        'hien_thi' => 'boolean',
    ];

    public function danhMuc()
    {
        return $this->belongsTo(DanhMuc::class, 'ma_danh_muc', 'ma_danh_muc');
    }

    public function chiTietDonHangs()
    {
        return $this->hasMany(ChiTietDonHang::class, 'ma_san_pham', 'ma_san_pham');
    }
}
