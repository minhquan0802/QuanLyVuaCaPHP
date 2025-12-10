import Header from "../components/header";
import Footer from "../components/footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [isSaving, setIsSaving] = useState(false); // Thêm state loading khi đang lưu
    // --- State cho Edit ---
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        ho_ten: "",
        email: "",
        so_dien_thoai: "",
        dia_chi: ""
    });

    const APP_BASE_URL = "http://127.0.0.1:8000/api";

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy ID từ localStorage (khớp với logic login của bạn)
                const userId = localStorage.getItem('user_id');

                if (!userId) {
                    navigate('/');
                    return;
                }

                setLoading(true);
                const res = await fetch(`${APP_BASE_URL}/nguoi-dung/${userId}`);

                if (!res.ok) throw new Error("Không thể tải thông tin");

                const responseData = await res.json();

                if (responseData.success) {
                    setUser(responseData.data);
                    // Init form data
                    setEditForm({
                        ho_ten: responseData.data.ho_ten || "",
                        email: responseData.data.email || "",
                        so_dien_thoai: responseData.data.so_dien_thoai || "",
                        dia_chi: responseData.data.dia_chi || ""
                    });
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
        localStorage.removeItem('user_id');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('storage'));
        navigate('/');
    };

    // --- Hàm xử lý Edit ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!user) return;

        setIsSaving(true);
        try {
            const res = await fetch(`${APP_BASE_URL}/nguoi-dung/${user.ma_nguoi_dung}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    ho_ten: editForm.ho_ten,
                    email: editForm.email,
                    so_dien_thoai: editForm.so_dien_thoai,
                    dia_chi: editForm.dia_chi
                    // Không gửi password nếu không đổi
                })
            });

            const result = await res.json();

            if (res.ok && result.success) {
                alert("Cập nhật thành công!");
                setUser(result.data); // Cập nhật lại UI chính

                // Cập nhật LocalStorage để đồng bộ Header
                // Merge dữ liệu cũ với mới để đảm bảo không mất các field quan trọng khác (nếu backend trả về thiếu)
                // Dù backend của bạn trả về đủ, nhưng đây là thói quen tốt (defensive programming)
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                const updatedUser = { ...currentUser, ...result.data };

                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                window.dispatchEvent(new Event('storage'));

                setIsEditing(false);
            } else {
                alert(result.message || "Cập nhật thất bại");
            }

        } catch (error) {
            console.error("Lỗi lưu:", error);
            alert("Lỗi kết nối đến server");
        } finally {
            setIsSaving(false); // Kết thúc lưu
        }
    };

    if (loading) return (
        <div className="bg-slate-50 min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!user) return null;

    return (
        <div className="bg-slate-50 font-body text-slate-600 min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">

                    <div className="mb-8 flex justify-between items-end">
                        <div>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-blue-900 leading-tight">
                                Hồ sơ của tôi
                            </h1>
                            <p className="mt-2 text-slate-500">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                        </div>

                        {/* Nút Toggle Edit */}
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                Chỉnh sửa
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        // Reset form về dữ liệu cũ
                                        setEditForm({
                                            ho_ten: user.ho_ten,
                                            email: user.email,
                                            so_dien_thoai: user.so_dien_thoai,
                                            dia_chi: user.dia_chi
                                        });
                                    }}
                                    className="px-5 py-2.5 bg-white border border-slate-300 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                                >
                                    Hủy
                                </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className={`px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isSaving ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                Đang lưu...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-[20px]">save</span>
                                                Lưu lại
                                            </>
                                        )}
                                    </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN: Avatar & Quick Info (Giữ nguyên - Read Only) */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 flex flex-col items-center text-center h-full">
                                <div className="relative mb-4">
                                    <div className="size-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-4 border-white shadow-md">
                                        <span className="material-symbols-outlined text-6xl">person</span>
                                    </div>
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

                        {/* RIGHT COLUMN: Detailed Info (Editable) */}
                        <div className="lg:col-span-2 space-y-6">

                            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                                    <span className="material-symbols-outlined text-blue-600 text-2xl">badge</span>
                                    <h3 className="text-lg font-bold text-blue-900">Thông tin cá nhân</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mã người dùng</label>
                                        <div className="p-3 bg-slate-50 rounded-lg text-slate-500 font-medium border border-slate-100 cursor-not-allowed">
                                            #{user.ma_nguoi_dung}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Họ và tên</label>
                                        {isEditing ? (
                                            <input
                                                name="ho_ten"
                                                value={editForm.ho_ten}
                                                onChange={handleInputChange}
                                                className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            />
                                        ) : (
                                            <div className="p-3 bg-slate-50 rounded-lg text-slate-700 font-medium border border-slate-100">
                                                {user.ho_ten}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                                        {isEditing ? (
                                            <input
                                                name="email"
                                                value={editForm.email}
                                                onChange={handleInputChange}
                                                className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            />
                                        ) : (
                                            <div className="p-3 bg-slate-50 rounded-lg text-slate-700 font-medium border border-slate-100 truncate">
                                                {user.email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Số điện thoại</label>
                                        {isEditing ? (
                                            <input
                                                name="so_dien_thoai"
                                                value={editForm.so_dien_thoai}
                                                onChange={handleInputChange}
                                                className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            />
                                        ) : (
                                            <div className="p-3 bg-slate-50 rounded-lg text-slate-700 font-medium border border-slate-100">
                                                {user.so_dien_thoai || "Chưa cập nhật"}
                                            </div>
                                        )}
                                    </div>

                                    {/* Địa chỉ (Full width) */}
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Địa chỉ</label>
                                        {isEditing ? (
                                            <input
                                                name="dia_chi"
                                                value={editForm.dia_chi}
                                                onChange={handleInputChange}
                                                className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            />
                                        ) : (
                                            <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                                <span className="material-symbols-outlined text-blue-500 mt-0.5">home_pin</span>
                                                <span className="text-slate-700 leading-relaxed">
                                                    {user.dia_chi || "Chưa cập nhật địa chỉ"}
                                                </span>
                                            </div>
                                        )}
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