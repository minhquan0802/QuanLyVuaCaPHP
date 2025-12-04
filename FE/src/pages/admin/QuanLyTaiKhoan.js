import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

export default function QuanLyTaiKhoan() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Cấu hình danh sách vai trò (Mapping theo string role của Laravel)
    const roles = [
        { value: "admin", label: "Quản trị viên (Admin)" },
        { value: "staff", label: "Nhân viên" },
        { value: "customer", label: "Khách hàng" },
    ];

    const APP_BASE_URL = "http://127.0.0.1:8000/api";

    // --- 1. Fetch Data ---
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${APP_BASE_URL}/nguoi-dung`);
            
            if (!res.ok) {
                throw new Error(`Lỗi kết nối: ${res.status}`);
            }
            
            const data = await res.json();
            
            // Xử lý dữ liệu trả về (Laravel thường trả về { data: [...] } hoặc mảng trực tiếp)
            let realData = [];
            if (data.data && Array.isArray(data.data)) {
                realData = data.data;
            } else if (Array.isArray(data)) {
                realData = data;
            } else if (data.success && data.data) {
                realData = data.data;
            }

            setAccounts(realData);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- 2. Modal Logic ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // State form (Field names khớp với database/Laravel)
    const [currentUser, setCurrentUser] = useState({
        ma_nguoi_dung: "",
        ho_ten: "",
        email: "",
        mat_khau: "", // Lưu ý: Laravel thường dùng password hoặc mat_khau
        so_dien_thoai: "",
        dia_chi: "",
        role: "customer", 
        trang_thai: "active" // active / inactive
    });

    const handleAddNew = () => {
        setIsEditing(false);
        setCurrentUser({
            ma_nguoi_dung: "",
            ho_ten: "",
            email: "",
            mat_khau: "",
            so_dien_thoai: "",
            dia_chi: "",
            role: "customer",
            trang_thai: "active"
        });
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setIsEditing(true);
        setCurrentUser({
            ...user,
            mat_khau: "" // Không hiển thị mật khẩu cũ, để trống nếu không muốn đổi
        });
        setIsModalOpen(true);
    };

    // --- 3. CRUD Actions ---
    
    // XÓA TÀI KHOẢN
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
            try {
                const res = await fetch(`${APP_BASE_URL}/nguoi-dung/${id}`, { 
                    method: "DELETE" 
                });
                
                if (!res.ok) {
                    throw new Error("Lỗi khi xóa từ server");
                }
                
                // Cập nhật lại danh sách trên giao diện
                setAccounts(accounts.filter(item => item.ma_nguoi_dung !== id));
                alert("Đã xóa thành công!");
            } catch (error) {
                console.error(error);
                alert("Không thể xóa: " + error.message);
            }
        }
    };

    // THÊM MỚI HOẶC CẬP NHẬT
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Chuẩn bị payload
        const payload = {
            ho_ten: currentUser.ho_ten,
            email: currentUser.email,
            so_dien_thoai: currentUser.so_dien_thoai,
            dia_chi: currentUser.dia_chi,
            role: currentUser.role,
            trang_thai: currentUser.trang_thai
        };

        // Chỉ gửi mật khẩu nếu đang thêm mới hoặc người dùng nhập mật khẩu mới khi sửa
        if (!isEditing || currentUser.mat_khau) {
            payload.mat_khau = currentUser.mat_khau;
        }

        try {
            const url = isEditing 
                ? `${APP_BASE_URL}/nguoi-dung/${currentUser.ma_nguoi_dung}`
                : `${APP_BASE_URL}/nguoi-dung`;
                
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || `Lỗi server (${res.status})`);
            }

            alert(isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!");
            setIsModalOpen(false);
            fetchData(); // Reload lại danh sách

        } catch (error) {
            console.error("Lỗi lưu:", error);
            alert("Có lỗi xảy ra: " + error.message);
        }
    };

    // Helper: Lấy tên vai trò hiển thị
    const getRoleLabel = (roleValue) => {
        const role = roles.find(r => r.value === roleValue);
        return role ? role.label : roleValue;
    };

    // Helper: Màu sắc badge theo vai trò
    const getRoleColor = (roleValue) => {
        switch (roleValue) {
            case 'admin': return "bg-purple-100 text-purple-700 border-purple-200";
            case 'staff': return "bg-blue-100 text-blue-700 border-blue-200";
            case 'customer': return "bg-green-100 text-green-700 border-green-200";
            default: return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    return (
        <AdminLayout title="Quản Lý Tài Khoản">
            
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-96">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input type="text" placeholder="Tìm theo tên, email..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button onClick={handleAddNew} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                    <span className="material-symbols-outlined">person_add</span>
                    Thêm Tài Khoản
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Họ và Tên</th>
                                <th className="p-4">Email / SĐT</th>
                                <th className="p-4">Vai Trò</th>
                                <th className="p-4">Trạng Thái</th>
                                <th className="p-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="size-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            Đang tải dữ liệu...
                                        </div>
                                    </td>
                                </tr>
                            ) : accounts.length > 0 ? (
                                accounts.map((item) => (
                                    <tr key={item.ma_nguoi_dung} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="p-4 text-slate-400">#{item.ma_nguoi_dung}</td>
                                        <td className="p-4 font-bold text-blue-900">
                                            {item.ho_ten}
                                            <div className="text-xs text-slate-400 font-normal mt-0.5 truncate max-w-[200px]">{item.dia_chi}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium">{item.email}</div>
                                            <div className="text-xs text-slate-500">{item.so_dien_thoai || "-"}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-md border text-xs font-bold ${getRoleColor(item.role)}`}>
                                                {getRoleLabel(item.role)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${item.trang_thai === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                <span className={`size-1.5 rounded-full ${item.trang_thai === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                {item.trang_thai === 'active' ? 'Hoạt động' : 'Đã khóa'}
                                            </span>
                                        </td>
                                        <td className="p-4 flex justify-center gap-2">
                                            <button onClick={() => handleEdit(item)} className="size-9 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Chỉnh sửa">
                                                <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                            </button>
                                            <button onClick={() => handleDelete(item.ma_nguoi_dung)} className="size-9 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Xóa">
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-slate-400 italic">
                                        Chưa có tài khoản nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto ring-1 ring-slate-900/5">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">{isEditing ? "manage_accounts" : "person_add"}</span>
                                {isEditing ? "Cập nhật Tài khoản" : "Thêm Tài khoản mới"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="size-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Họ & Tên */}
                            <div className="md:col-span-2">
                                <label className="label-text">Họ và Tên</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="input-field" 
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    value={currentUser.ho_ten} 
                                    onChange={e => setCurrentUser({...currentUser, ho_ten: e.target.value})} 
                                />
                            </div>

                            {/* Email & Pass */}
                            <div className="md:col-span-1">
                                <label className="label-text">Email</label>
                                <input 
                                    type="email" 
                                    required 
                                    className="input-field" 
                                    placeholder="example@gmail.com"
                                    value={currentUser.email} 
                                    onChange={e => setCurrentUser({...currentUser, email: e.target.value})} 
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="label-text">
                                    Mật khẩu 
                                    {isEditing && <span className="text-xs font-normal text-slate-400 ml-1">(Bỏ trống nếu không đổi)</span>}
                                </label>
                                <input 
                                    type="password" 
                                    required={!isEditing} 
                                    className="input-field" 
                                    placeholder="••••••••"
                                    value={currentUser.mat_khau} 
                                    onChange={e => setCurrentUser({...currentUser, mat_khau: e.target.value})} 
                                />
                            </div>

                            {/* SĐT & Địa chỉ */}
                            <div className="md:col-span-1">
                                <label className="label-text">Số điện thoại</label>
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    placeholder="0912..."
                                    value={currentUser.so_dien_thoai} 
                                    onChange={e => setCurrentUser({...currentUser, so_dien_thoai: e.target.value})} 
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="label-text">Địa chỉ</label>
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    placeholder="Quận, Thành phố..."
                                    value={currentUser.dia_chi} 
                                    onChange={e => setCurrentUser({...currentUser, dia_chi: e.target.value})} 
                                />
                            </div>

                            {/* Role & Status */}
                            <div className="md:col-span-1">
                                <label className="label-text">Vai trò</label>
                                <select 
                                    className="input-field bg-white" 
                                    value={currentUser.role} 
                                    onChange={e => setCurrentUser({...currentUser, role: e.target.value})}
                                >
                                    {roles.map(role => (
                                        <option key={role.value} value={role.value}>{role.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-1">
                                <label className="label-text">Trạng thái</label>
                                <select 
                                    className="input-field bg-white" 
                                    value={currentUser.trang_thai} 
                                    onChange={e => setCurrentUser({...currentUser, trang_thai: e.target.value})}
                                >
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Khóa / Ngưng hoạt động</option>
                                </select>
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-slate-100 mt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-sm transition-colors">Hủy bỏ</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                                    {isEditing ? "Lưu thay đổi" : "Tạo tài khoản"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CSS-in-JS nhỏ gọn cho input */}
            <style>{`
                .label-text { display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 0.35rem; }
                .input-field { width: 100%; padding: 0.6rem 1rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; outline: none; transition: all 0.2s; font-size: 0.95rem; color: #1e293b; }
                .input-field:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
                .input-field::placeholder { color: #cbd5e1; }
            `}</style>
        </AdminLayout>
    );
}