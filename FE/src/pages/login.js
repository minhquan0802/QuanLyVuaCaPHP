import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  // State quản lý form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // State quản lý trạng thái
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Cấu hình URL API
  const APP_BASE_URL = 'https://backendfish.mnhwua.id.vn';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validate cơ bản phía client
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    setLoading(true);

    try {
      // 2. Gọi API thực tế
      const res = await fetch(`${APP_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: email,
          mat_khau: password,
        }),
      });

      const result = await res.json();

      // 3. Xử lý kết quả trả về
      if (!res.ok || !result.success) {
        throw new Error(
          result.message || 'Email hoặc mật khẩu không chính xác.'
        );
      }

      // 4. Xử lý lưu thông tin (CẬP NHẬT QUAN TRỌNG)
      const user = result.data;

      // --- LƯU ID ĐỂ TRANG PROFILE SỬ DỤNG ---
      // API trả về 'ma_nguoi_dung', ta lưu vào 'user_id' để khớp với UserProfile.js
      localStorage.setItem('user_id', user.ma_nguoi_dung);

      // Lưu toàn bộ thông tin user (để dùng hiển thị nhanh ở Header nếu cần)
      localStorage.setItem('currentUser', JSON.stringify(user));

      // Phát sự kiện để Header cập nhật giao diện (ẩn nút Login, hiện Avatar)
      window.dispatchEvent(new Event('storage'));

      console.log('User logged in:', user);

      // 5. Điều hướng
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      console.error('Login Error:', err);
      if (err.message === 'Failed to fetch') {
        setError(
          'Không thể kết nối đến Server. Vui lòng kiểm tra lại đường truyền.'
        );
      } else {
        setError(err.message || 'Có lỗi xảy ra khi đăng nhập.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="font-sans min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      {/* CSS Ẩn mắt mặc định của input password */}
      <style>{`
                input::-ms-reveal, input::-ms-clear { display: none; }
            `}</style>

      {/* Main Content - Single Centered Card */}
      <div className="w-full max-w-[480px]">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 p-8 md:p-10">
          {/* Header: Logo & Title */}
          <div className="text-center mb-8">
            {/* Logo icon */}
            <div className="mx-auto mb-4 w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Đăng nhập</h2>
            <p className="text-gray-500 text-sm mt-2">
              Thủy Sản Minh Mạnh Quân xin chào!
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Email hoặc số điện thoại
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ví dụ: khachhang@gmail.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px] align-middle">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm mt-1">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="group-hover:text-blue-700 transition-colors">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              {/* Nhớ import Link ở đầu file: import { useNavigate, Link } from "react-router-dom"; */}
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-2 w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-base shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 transform active:scale-[0.99] transition-all duration-200
                            ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                'Đăng nhập ngay'
              )}
            </button>
          </form>

          {/* Dang nhap bang GG*/}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-slate-500">
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              {/* Nút Google */}
              <a
                href="https://backendfish.mnhwua.id.vn/auth/google" // Trỏ về Route Laravel vừa tạo
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 transition-all active:scale-95"
              >
                <img
                  className="h-5 w-5"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                />
                Google
              </a>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Bạn chưa có tài khoản?
              <button
                onClick={handleRegister}
                className="ml-1 text-blue-600 font-bold hover:text-blue-800 hover:underline transition-all"
              >
                Đăng ký
              </button>
            </p>
          </div>
        </div>

        {/* Footer outside card */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            &copy; 2024 Vựa Cá Minh Mạnh Quân
          </p>
        </div>
      </div>
    </div>
  );
}
