<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChiTietDonHang extends Model
{
    protected $table = 'chi_tiet_don_hang';
    
    protected $fillable = [
        'ma_don_hang',
        'ma_san_pham',
        'so_luong',
        'gia_mua',
    ];

    protected $casts = [
        'gia_mua' => 'decimal:2',
    ];

    public function donHang()
    {
        return $this->belongsTo(DonHang::class, 'ma_don_hang', 'ma_don_hang');
    }

    public function sanPham()
    {
        return $this->belongsTo(SanPham::class, 'ma_san_pham', 'ma_san_pham');
    }
}
