<?php

namespace App\Models;

// 1. Sửa dòng này: Kế thừa từ Authenticatable thay vì Model thường để dùng tính năng Auth
use Illuminate\Foundation\Auth\User as Authenticatable; 
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Import Sanctum
use Illuminate\Database\Eloquent\Factories\HasFactory;

// 2. Class kế thừa Authenticatable
class NguoiDung extends Authenticatable 
{
    // 3. QUAN TRỌNG: Phải có dòng này thì mới dùng được createToken()
    use HasApiTokens, HasFactory, Notifiable;

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
        'google_id', // 4. QUAN TRỌNG: Thêm trường này để lưu ID Google
    ];

    protected $hidden = [
        'mat_khau',
        'remember_token',
    ];

    protected $casts = [
        'ngay_tao' => 'datetime',
    ];

    public function donHangs()
    {
        return $this->hasMany(DonHang::class, 'ma_nguoi_dung', 'ma_nguoi_dung');
    }
}