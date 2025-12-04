<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NguoiDung extends Model
{
    protected $table = 'nguoi_dung';
    protected $primaryKey = 'ma_nguoi_dung';
    
    protected $fillable = [
        'ho_ten',
        'email',
        'mat_khau',
        'so_dien_thoai',
        'dia_chi',
        'ngay_tao',
        'role', 
    ];

    protected $hidden = [
        'mat_khau',
    ];

    protected $casts = [
        'ngay_tao' => 'datetime',
    ];

    public function donHangs()
    {
        return $this->hasMany(DonHang::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }
}
