<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class PasswordResetLinkController extends Controller
{
    /**
     * Handle an incoming password reset link request.
     */
    public function store(Request $request)
    {
        // 1. Validate email
        $request->validate([
            'email' => 'required|email',
        ]);

        // 2. Gửi link reset mật khẩu vào email
        // Laravel sẽ tự tìm trong bảng 'nguoi_dung' (hoặc 'users') xem email có tồn tại không
        $status = Password::sendResetLink(
            $request->only('email')
        );

        // 3. Trả về kết quả JSON cho React
        if ($status == Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => true,
                'message' => __($status) // "Chúng tôi đã gửi liên kết đặt lại mật khẩu qua email!"
            ]);
        }

        // Nếu lỗi (ví dụ email không tồn tại)
        return response()->json([
            'success' => false,
            'message' => __($status),
            'email' => __($status)
        ], 400);
    }
}