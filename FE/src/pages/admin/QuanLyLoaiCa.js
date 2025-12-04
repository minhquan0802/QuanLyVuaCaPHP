import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

export default function QuanLyLoaiCa() {
    // 1. State lưu trữ dữ liệu
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cấu hình URL API
    const APP_BASE_URL = "http://localhost:8080/QuanLyVuaCa";

    // 2. Fetch Data từ API khi trang vừa tải
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${APP_BASE_URL}/Loaicas`);

                if (!res.ok) {
                    throw new Error("Lỗi kết nối server");
                }

                const data = await res.json();
                console.log("Categories fetched:", data);

                // Xử lý dữ liệu trả về (mảng trực tiếp hoặc bọc trong object)
                let realData = [];
                if (Array.isArray(data)) {
                    realData = data;
                } else if (data.result && Array.isArray(data.result)) {
                    realData = data.result;
                } else if (data.data && Array.isArray(data.data)) {
                    realData = data.data;
                }

                setCategories(realData);
                console.log(realData);
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 3. Hàm xử lý hiển thị ảnh thông minh
    const getImageUrl = (imageName) => {
        if (!imageName) return 'https://placehold.co/100x100?text=No+Image';
        if (imageName.startsWith('http')) return imageName;

        // Nếu DB lưu đường dẫn đầy đủ (/images/...)
        if (imageName.startsWith('/')) {
            return `${APP_BASE_URL}${imageName}`;
        }

        // Nếu DB chỉ lưu tên file (ví dụ: "ca-dieu-hong.jpg") -> Nối thêm thư mục mặc định
        return `${APP_BASE_URL}/images/loaica/${imageName}`;
    };

    // --- LOGIC CHO MODAL (THÊM / SỬA) ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ id: null, tenloaica: "", mieuta: "", hinhanhurl: "" });

    const handleMoTabThemMoi = () => {
        setIsEditing(false);
        setCurrentCategory({ id: null, tenloaica: "", mieuta: "", hinhanhurl: "" });
        setIsModalOpen(true);
    };

    // const handleSave = async (e) => {
    //     e.preventDefault();

    //     try {
    //         if (!isEditing) {
    //             const res = await fetch(`${APP_BASE_URL}/Loaicas`, {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify({
    //                     tenloaica: currentCategory.tenloaica,
    //                     mieuta: currentCategory.mieuta,
    //                     hinhanhurl: currentCategory.hinhanhurl
    //                 }),
    //             });

    //             if (!res.ok) {
    //                 let msg = "Lỗi không xác định";

    //                 try {
    //                     const errorJson = await res.json();
    //                     msg = errorJson.message || msg;
    //                 } catch {
    //                     msg = await res.text();
    //                 }

    //                 throw new Error(msg);
    //             }

    //             const data = await res.json();
    //             const newCategory = data.result || data;
    //             setCategories([...categories, newCategory]);

    //             alert("Thêm loại cá thành công!");
    //             setIsModalOpen(false);
    //         }

    //     } catch (error) {
    //         alert("Có lỗi xảy ra: " + error.message);
    //         console.error("Lỗi lưu dữ liệu:", error);
    //     }
    // };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("tenloaica", currentCategory.tenloaica);
            formData.append("mieuta", currentCategory.mieuta);
            formData.append("hinhanh", currentCategory.hinhanhFile);

            const res = await fetch(`${APP_BASE_URL}/Loaicas`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                let errorMessage = "Lỗi server";

                try {
                    const err = await res.json();
                    errorMessage = err.message || errorMessage;
                } catch {
                    const errText = await res.text();
                    errorMessage = errText || errorMessage;
                }

                throw new Error(errorMessage);
            }

            const data = await res.json();
            const newCategory = data.result;

            setCategories([...categories, newCategory]);
            alert("Thêm loại cá thành công!");
            setIsModalOpen(false);

        } catch (error) {
            alert("Có lỗi xảy ra: " + error.message);
        }
    };




    const handleEdit = (category) => {
        setIsEditing(true);
        setCurrentCategory(category);
        setIsModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            // 1. Dùng FormData thay vì JSON
            const formData = new FormData();
            formData.append("tenloaica", currentCategory.tenloaica);
            formData.append("mieuta", currentCategory.mieuta);

            // Kiểm tra xem có file ảnh MỚI được chọn không
            // (Lưu ý: hinhanhFile là state bạn lưu file object từ input type="file")
            if (currentCategory.hinhanhFile) {
                formData.append("hinhanh", currentCategory.hinhanhFile);
            }

            // 2. Gọi API PUT
            const res = await fetch(`${APP_BASE_URL}/Loaicas/${currentCategory.id}`, {
                method: "PUT",
                // QUAN TRỌNG: KHÔNG ĐƯỢC SET 'Content-Type': 'multipart/form-data'
                // Hãy để trình duyệt tự làm việc đó
                body: formData,
            });

            if (!res.ok) {
                let errorMessage = "Lỗi server";
                try {
                    const errorJson = await res.json();
                    errorMessage = errorJson.message || errorMessage;
                } catch {
                    const errorText = await res.text();
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const data = await res.json();
            const updatedCategory = data.result;

            // 3. Cập nhật State
            setCategories(categories.map(item =>
                item.id === updatedCategory.id ? updatedCategory : item
            ));

            alert("Cập nhật thành công!");
            setIsModalOpen(false);
            // Reset file tạm sau khi update xong
            setCurrentCategory(prev => ({ ...prev, hinhanhFile: null }));

        } catch (error) {
            console.error("Lỗi cập nhật dữ liệu:", error);
            alert("Có lỗi xảy ra khi cập nhật: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa loại cá này?")) {
            try {
                // [LOGIC MỚI] Gọi API DELETE
                const res = await fetch(`${APP_BASE_URL}/Loaicas/${id}`, {
                    method: "DELETE",
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Lỗi Server (${res.status}): ${errorText}`);
                }

                // Nếu xóa thành công trên server, cập nhật lại giao diện (bỏ item có id tương ứng)
                setCategories(categories.filter(item => item.id !== id));
                alert("Đã xóa thành công!");

            } catch (error) {
                console.error("Lỗi khi xóa:", error);
                alert("Không thể xóa: " + error.message);
            }
        }
    };



    return (
        <AdminLayout title="Quản Lý Loại Cá">

            {/* --- TOOLBAR: Tìm kiếm & Thêm mới --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full md:w-96">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm loại cá..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                </div>
                <button
                    onClick={handleMoTabThemMoi}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined">add</span>
                    Thêm Loại Cá
                </button>
            </div>

            {/* --- MAIN TABLE --- */}
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                                <th className="p-4 w-16 text-center">ID</th>
                                <th className="p-4 w-24">Hình ảnh</th>
                                <th className="p-4">Tên Loại Cá</th>
                                <th className="p-4">Miêu tả</th>
                                <th className="p-4 text-center w-32">Thao tác</th>
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
                                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="p-4 text-center font-medium text-slate-500">#{item.id}</td>
                                        <td className="p-4">
                                            <div className="size-12 rounded-lg border border-slate-200 overflow-hidden bg-slate-100 relative">
                                                <img
                                                    src={getImageUrl(item.hinhanhurl)}
                                                    alt={item.tenloaica}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Error' }}
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold text-blue-900">{item.tenloaica}</td>
                                        <td className="p-4 text-slate-500 truncate max-w-xs" title={item.mieuta}>
                                            {item.mieuta}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="size-8 flex items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Sửa"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="size-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Xóa"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        Không có loại cá nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
                    <span>Hiển thị {categories.length} kết quả</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50">Trước</button>
                        <button className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50">Sau</button>
                    </div>
                </div>
            </div>

            {/* --- MODAL ADD/EDIT --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-lg text-slate-800">
                                {isEditing ? "Cập nhật Loại Cá" : "Thêm Loại Cá Mới"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={isEditing ? handleUpdate : handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Tên loại cá</label>
                                <input
                                    type="text"
                                    required
                                    value={currentCategory.tenloaica}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, tenloaica: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Ví dụ: Cá Điêu Hồng"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Tên file hình ảnh</label>
                                {/* <input
                                    type="text"
                                    value={currentCategory.hinhanhurl}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, hinhanhurl: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Ví dụ: ca-dieu-hong.jpg"
                                /> 
                                <p className="text-xs text-slate-400 mt-1">Nhập tên file ảnh trong thư mục /images/loaica/</p>*/}
                                <input
                                    type="file"
                                    accept=".jpg, .jpeg, .png, image/png, image/jpeg"
                                    onChange={(e) =>
                                        setCurrentCategory({
                                            ...currentCategory,
                                            hinhanhFile: e.target.files[0]   // lưu file ảnh
                                        })
                                    }
                                    className="w-full px-4 py-2 rounded-lg border"
                                />
                                <p className="text-xs text-slate-400 mt-1">Chọn hình ảnh loại cá</p>


                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Miêu tả</label>
                                <textarea
                                    rows="3"
                                    value={currentCategory.mieuta}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, mieuta: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Nhập mô tả chi tiết..."
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                                >
                                    {isEditing ? "Lưu thay đổi" : "Thêm mới"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}