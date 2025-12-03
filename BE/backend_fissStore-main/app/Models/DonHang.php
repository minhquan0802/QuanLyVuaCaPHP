<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonHang extends Model
{
    protected $table = 'don_hang';
    protected $primaryKey = 'ma_don_hang';
    
    protected $fillable = [
        'ma_nguoi_dung',
        'ngay_dat',
        'tong_tien',
        'trang_thai',
        'dia_chi_giao_hang',
        'ghi_chu',
    ];

    protected $casts = [
        'ngay_dat' => 'datetime',
        'tong_tien' => 'decimal:2',
    ];

    public function nguoiDung()
    {
        return $this->belongsTo(NguoiDung::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }

    public function chiTietDonHangs()
    {
        return $this->hasMany(ChiTietDonHang::class, 'ma_don_hang', 'ma_don_hang');
    }

    public function thanhToan()
    {
        return $this->hasOne(ThanhToan::class, 'ma_don_hang', 'ma_don_hang');
    }
}
