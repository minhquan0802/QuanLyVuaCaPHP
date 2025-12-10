<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DanhMuc extends Model
{
    protected $table = 'danh_muc';
    protected $primaryKey = 'ma_danh_muc';
    
    protected $fillable = [
        'ten_danh_muc',
        'mo_ta',
    ];

    public function sanPhams()
    {
        return $this->hasMany(SanPham::class, 'ma_danh_muc', 'ma_danh_muc');
    }
}
