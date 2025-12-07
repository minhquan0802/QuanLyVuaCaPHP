import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

export default function QuanLyDanhMuc() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // URL API (Giả định endpoint là /danh-muc)
    const APP_BASE_URL = "http://127.0.0.1:8000/api";

    // --- 1. Fetch Data ---
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${APP_BASE_URL}/danh-muc`);
            
            if (!res.ok) {
                throw new Error(`Lỗi kết nối: ${res.status}`);
            }
            
            const data = await res.json();
            
            // Xử lý dữ liệu trả về
            let realData = [];
            if (data.data && Array.isArray(data.data)) {
                realData = data.data;
            } else if (Array.isArray(data)) {
                realData = data;
            }

            setCategories(realData);
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
    
    // State form (Field names khớp với database trong hình)
    const [currentCategory, setCurrentCategory] = useState({
        ma_danh_muc: "",
        ten_danh_muc: "",
        mo_ta: ""
    });

    const handleAddNew = () => {
        setIsEditing(false);
        setCurrentCategory({
            ma_danh_muc: "",
            ten_danh_muc: "",
            mo_ta: ""
        });
        setIsModalOpen(true);
    };

    const handleEdit = (category) => {
        setIsEditing(true);
        setCurrentCategory({ ...category });
        setIsModalOpen(true);
    };

    // --- 3. CRUD Actions ---
    
    // XÓA DANH MỤC
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            try {
                const res = await fetch(`${APP_BASE_URL}/danh-muc/${id}`, { 
                    method: "DELETE" 
                });
                
                if (!res.ok) {
                    throw new Error("Lỗi khi xóa từ server");
                }
                
                setCategories(categories.filter(item => item.ma_danh_muc !== id));
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
        
        // Payload khớp với database
        const payload = {
            ten_danh_muc: currentCategory.ten_danh_muc,
            mo_ta: currentCategory.mo_ta
        };

        try {
            const url = isEditing 
                ? `${APP_BASE_URL}/danh-muc/${currentCategory.ma_danh_muc}`
                : `${APP_BASE_URL}/danh-muc`;
                
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
            fetchData(); 

        } catch (error) {
            console.error("Lỗi lưu:", error);
            alert("Có lỗi xảy ra: " + error.message);
        }
    };

    return (
        <AdminLayout title="Quản Lý Danh Mục">
            
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-96">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input type="text" placeholder="Tìm tên danh mục..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button onClick={handleAddNew} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                    <span className="material-symbols-outlined">add_circle</span>
                    Thêm Danh Mục
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                            <tr>
                                <th className="p-4">Mã DM</th>
                                <th className="p-4">Tên Danh Mục</th>
                                <th className="p-4">Mô Tả</th>
                                <th className="p-4">Ngày Tạo</th>
                                <th className="p-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="size-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            Đang tải dữ liệu...
                                        </div>
                                    </td>
                                </tr>
                            ) : categories.length > 0 ? (
                                categories.map((item) => (
                                    <tr key={item.ma_danh_muc} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="p-4 text-slate-400">#{item.ma_danh_muc}</td>
                                        <td className="p-4 font-bold text-blue-900">
                                            {item.ten_danh_muc}
                                        </td>
                                        <td className="p-4 text-slate-600 max-w-md truncate" title={item.mo_ta}>
                                            {item.mo_ta || "-"}
                                        </td>
                                        {/* <td className="p-4 text-slate-500 text-xs">
                                            {item.created_at || "-"}
                                        </td> */}
                                        <td className="p-4 text-slate-500 text-xs">
                                            {item.created_at ? new Date(item.created_at).toLocaleString() : "-"}
                                        </td>

                                        <td className="p-4 flex justify-center gap-2">
                                            <button onClick={() => handleEdit(item)} className="size-9 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Chỉnh sửa">
                                                <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                            </button>
                                            <button onClick={() => handleDelete(item.ma_danh_muc)} className="size-9 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Xóa">
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-slate-400 italic">
                                        Chưa có danh mục nào.
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
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden ring-1 ring-slate-900/5">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">{isEditing ? "edit" : "category"}</span>
                                {isEditing ? "Cập nhật Danh Mục" : "Thêm Danh Mục mới"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="size-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 gap-5">
                            {/* Tên danh mục */}
                            <div>
                                <label className="label-text">Tên Danh Mục <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    required 
                                    className="input-field" 
                                    placeholder="Ví dụ: Hải sản tươi sống"
                                    value={currentCategory.ten_danh_muc} 
                                    onChange={e => setCurrentCategory({...currentCategory, ten_danh_muc: e.target.value})} 
                                />
                            </div>

                            {/* Mô tả */}
                            <div>
                                <label className="label-text">Mô tả</label>
                                <textarea 
                                    className="input-field h-24 resize-none" 
                                    placeholder="Mô tả chi tiết về danh mục..."
                                    value={currentCategory.mo_ta} 
                                    onChange={e => setCurrentCategory({...currentCategory, mo_ta: e.target.value})} 
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-sm transition-colors">Hủy bỏ</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                                    {isEditing ? "Lưu thay đổi" : "Thêm mới"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .label-text { display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 0.35rem; }
                .input-field { width: 100%; padding: 0.6rem 1rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; outline: none; transition: all 0.2s; font-size: 0.95rem; color: #1e293b; }
                .input-field:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
                .input-field::placeholder { color: #cbd5e1; }
            `}</style>
        </AdminLayout>
    );
}