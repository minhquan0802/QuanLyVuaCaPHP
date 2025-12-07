import Header from "../components/header";
import Footer from "../components/footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // CẤU HÌNH SERVER
    const APP_BASE_URL = "http://127.0.0.1:8000/api";

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Lấy ID người dùng từ localStorage (Giả sử bạn đã lưu khi login)
                // Ví dụ: localStorage.setItem('user_id', data.ma_nguoi_dung);
                const userId = localStorage.getItem('user_id');

                if (!userId) {
                    // Nếu chưa đăng nhập, chuyển hướng về trang login
                    navigate('/');
                    return;
                }

                setLoading(true);
                // 2. Gọi API lấy thông tin chi tiết
                const res = await fetch(`${APP_BASE_URL}/nguoi-dung/${userId}`);

                if (!res.ok) {
                    throw new Error("Không thể tải thông tin người dùng");
                }

                const responseData = await res.json();
                
                // Kiểm tra cấu trúc trả về (theo mẫu bạn cung cấp: { success: true, data: {...} })
                if (responseData.success) {
                    setUser(responseData.data);
                } else {
                    console.error("API trả về lỗi:", responseData.message);
                }

            } catch (error) {
                console.error("Lỗi kết nối:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        // Xóa thông tin đăng nhập và giỏ hàng
        localStorage.removeItem('user_id');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');  // Tùy chọn: xóa giỏ hàng khi đăng xuất
        
        // Dispatch sự kiện để Header cập nhật lại giao diện (nếu Header có lắng nghe)
        window.dispatchEvent(new Event('storage'));
        
        navigate('/');
    };

    if (loading) {
        return (
            <div className="bg-slate-50 min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return null; // Hoặc hiển thị trang lỗi
    }

    return (
        <div className="bg-slate-50 font-body text-slate-600 min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                    
                    {/* Breadcrumbs & Title */}
                    <div className="mb-8">
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-blue-900 leading-tight">
                            Hồ sơ của tôi
                        </h1>
                        <p className="mt-2 text-slate-500">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* LEFT COLUMN: Avatar & Quick Info */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 flex flex-col items-center text-center h-full">
                                <div className="relative mb-4">
                                    <div className="size-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-4 border-white shadow-md">
                                        <span className="material-symbols-outlined text-6xl">person</span>
                                    </div>
                                    <div className="absolute bottom-0 right-0 bg-green-500 size-6 rounded-full border-2 border-white" title="Online"></div>
                                </div>
                                
                                <h2 className="text-xl font-bold text-blue-900">{user.ho_ten}</h2>
                                <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-wide">
                                    {user.role === 'customer' ? 'Khách hàng thân thiết' : user.role}
                                </p>

                                <div className="w-full border-t border-slate-100 my-6"></div>

                                <div className="w-full space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Ngày tham gia</span>
                                        <span className="font-medium text-slate-700">
                                            {new Date(user.ngay_tao || user.created_at).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Đơn hàng</span>
                                        <span className="font-medium text-slate-700">
                                            {user.don_hangs ? user.don_hangs.length : 0} đơn
                                        </span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleLogout}
                                    className="mt-8 w-full py-2.5 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-xl">logout</span>
                                    Đăng xuất
                                </button>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Detailed Info */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Personal Info Card */}
                            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                                    <span className="material-symbols-outlined text-blue-600 text-2xl">badge</span>
                                    <h3 className="text-lg font-bold text-blue-900">Thông tin cá nhân</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mã người dùng</label>
                                        <div className="p-3 bg-slate-50 rounded-lg text-slate-700 font-medium border border-slate-100">
                                            #{user.ma_nguoi_dung}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Họ và tên</label>
                                        <div className="p-3 bg-slate-50 rounded-lg text-slate-700 font-medium border border-slate-100">
                                            {user.ho_ten}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                                        <div className="p-3 bg-slate-50 rounded-lg text-slate-700 font-medium border border-slate-100 truncate">
                                            {user.email}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Số điện thoại</label>
                                        <div className="p-3 bg-slate-50 rounded-lg text-slate-700 font-medium border border-slate-100">
                                            {user.so_dien_thoai || "Chưa cập nhật"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address Info Card */}
                            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                                    <span className="material-symbols-outlined text-blue-600 text-2xl">location_on</span>
                                    <div className="flex-grow flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-blue-900">Địa chỉ giao hàng</h3>
                                        <button className="text-sm text-blue-600 font-medium hover:underline">Chỉnh sửa</button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Địa chỉ mặc định</label>
                                    <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                        <span className="material-symbols-outlined text-blue-500 mt-0.5">home_pin</span>
                                        <span className="text-slate-700 leading-relaxed">
                                            {user.dia_chi || "Chưa cập nhật địa chỉ"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
