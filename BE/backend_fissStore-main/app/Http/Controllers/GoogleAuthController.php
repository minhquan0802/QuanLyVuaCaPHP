<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client; // Bỏ xác thực SSL 

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\NguoiDung;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    // 1. Chuyển hướng người dùng sang trang Google Login
    public function redirectToGoogle()
    {
        // Laravel nói với trình duyệt: "Hãy qua trang của Google đi, mang theo cái Client ID này để
        //  Google biết là ứng dụng 'Minh Quân Fresh' đang yêu cầu đăng nhập."
        return Socialite::driver('google')->redirect();
    }

    // 2. Google gọi lại hàm này sau khi đăng nhập thành công
    public function handleGoogleCallback()
    {
        try {
            // Lấy thông tin user từ Google
            // $googleUser = Socialite::driver(driver: 'google')->stateless()->user();


            // // Code MỚI (Thêm setHttpClient để tắt verify):
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->setHttpClient(new Client(['verify' => false])) // Bỏ qua kiểm tra SSL
                ->user();


            // Tìm user trong DB xem đã tồn tại chưa (qua google_id hoặc email)
            $user = NguoiDung::where('google_id', $googleUser->id)
                             ->orWhere('email', $googleUser->email)
                             ->first();

            if (!$user) {
                // Nếu chưa có thì tạo mới
                $user = NguoiDung::create([
                    'ho_ten' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'mat_khau' => null, // Không có mật khẩu
                    'role' => 'customer', // Mặc định là khách hàng
                    'so_dien_thoai' => '', 
                    'dia_chi' => '',
                    'ngay_tao' => now(),
                ]);
            } else {
                // Nếu có rồi nhưng chưa có google_id (trường hợp email trùng), cập nhật google_id
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleUser->id]);
                }
            }

            // --- QUAN TRỌNG: TẠO TOKEN ĐỂ GỬI VỀ REACT ---
            // Giả sử bạn dùng Sanctum để cấp token
            $token = $user->createToken('GoogleAuthToken')->plainTextToken;

            // Xử lý dữ liệu user để gửi về FE (để lưu localStorage)
            $userData = json_encode([
                'ma_nguoi_dung' => $user->ma_nguoi_dung,
                'ho_ten' => $user->ho_ten,
                'email' => $user->email,
                'role' => $user->role,
                'so_dien_thoai' => $user->so_dien_thoai,
                'dia_chi' => $user->dia_chi
            ]);

            // CHUYỂN HƯỚNG VỀ FRONTEND (React) KÈM TOKEN TRÊN URL
            // Thay port 3000 bằng port React của bạn
            return redirect("http://localhost:3000/auth/google/callback?token={$token}&user_data=" . urlencode($userData));
            
        } catch (\Exception $e) {
            return redirect('http://localhost:3000/login?error=Lỗi đăng nhập Google');
            // dd($e->getMessage(), $e->getTraceAsString());
        }       
    }
}