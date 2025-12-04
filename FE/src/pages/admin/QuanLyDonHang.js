import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

export default function QuanLyDonHang() {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState({}); // State lưu danh sách khách hàng (Map ID -> Tên)
    const [loading, setLoading] = useState(true);

    const APP_BASE_URL = "http://localhost:8080/QuanLyVuaCa";

    // --- 1. Fetch Dữ liệu (Đơn hàng & Khách hàng) ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Gọi song song 2 API để tiết kiệm thời gian
                const [ordersRes, usersRes] = await Promise.all([
                    fetch(`${APP_BASE_URL}/Donhangs`),
                    fetch(`${APP_BASE_URL}/TaiKhoans`)
                ]);

                if (!ordersRes.ok || !usersRes.ok) throw new Error("Lỗi kết nối server");

                // Xử lý dữ liệu Đơn hàng
                const ordersData = await ordersRes.json();
                let realOrders = [];
                if (Array.isArray(ordersData)) realOrders = ordersData;
                else if (ordersData.result) realOrders = ordersData.result;
                else if (ordersData.data) realOrders = ordersData.data;
                
                setOrders(realOrders);

                // Xử lý dữ liệu Khách hàng -> Chuyển sang dạng Map { id: "Tên" } để tra cứu nhanh
                const usersData = await usersRes.json();
                let realUsers = [];
                if (Array.isArray(usersData)) realUsers = usersData;
                else if (usersData.result) realUsers = usersData.result;
                
                const userMap = {};
                realUsers.forEach(user => {
                    userMap[user.idtaikhoan] = `${user.ho} ${user.ten}`; // Ghép họ tên
                });
                setUsers(userMap);

            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // --- 2. Cập nhật trạng thái ---
    const handleUpdateStatus = async (id, newStatus) => {
        const confirmMsg = 
            newStatus === 'HUY' ? "Bạn chắc chắn muốn HỦY đơn này?" : 
            newStatus === 'DANG_DONG_HANG' ? "Xác nhận duyệt đơn hàng này?" :
            `Chuyển trạng thái sang: ${newStatus}?`;

        if (!window.confirm(confirmMsg)) return;

        try {
            const res = await fetch(`${APP_BASE_URL}/Donhangs/${id}/status?status=${newStatus}`, {
                method: "PUT"
            });

            if (!res.ok) throw new Error("Cập nhật thất bại");
            
            // Cập nhật nóng trên giao diện (Optimistic UI)
            setOrders(orders.map(ord => 
                ord.iddonhang === id ? { ...ord, trangthaidonhang: newStatus } : ord
            ));
            
            alert("Cập nhật thành công!");
        } catch (error) {
            alert(error.message);
        }
    };

    // --- Helper Functions ---
    const getStatusBadge = (status) => {
        switch (status) {
            case 'CHO_XAC_NHAN': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">Chờ xác nhận</span>;
            case 'DANG_DONG_HANG': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">Đang đóng hàng</span>;
            case 'DANG_VAN_CHUYEN': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">Đang giao</span>;
            case 'HOAN_TAT': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">Hoàn tất</span>;
            case 'HUY': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">Đã hủy</span>;
            default: return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{status}</span>;
        }
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return "0 đ";
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <AdminLayout title="Quản Lý Đơn Hàng">
            
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-96">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input type="text" placeholder="Tìm mã đơn..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Xuất Excel
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                            <tr>
                                <th className="p-4 w-32">Mã Đơn</th>
                                <th className="p-4">Khách Hàng</th>
                                <th className="p-4">Ngày Đặt</th>
                                <th className="p-4 text-right">Tổng Tiền</th>
                                <th className="p-4 text-center">Trạng Thái</th>
                                <th className="p-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-slate-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="size-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            Đang tải dữ liệu...
                                        </div>
                                    </td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((item) => (
                                    <tr key={item.iddonhang} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="p-4 font-mono text-xs text-slate-500" title={item.iddonhang}>
                                            #{item.iddonhang.substring(0, 8)}
                                        </td>
                                        <td className="p-4">
                                            {/* Hiển thị Tên thay vì ID */}
                                            <div className="font-bold text-slate-800">
                                                {users[item.idthongtinkhachhang] || "Khách vãng lai"}
                                            </div>
                                            <div className="text-xs text-slate-400 font-mono mt-0.5" title="ID Khách hàng">
                                                {item.idthongtinkhachhang?.substring(0, 8)}...
                                            </div>
                                        </td>
                                        <td className="p-4">{formatDate(item.ngaydat)}</td>
                                        
                                        {/* Hiển thị đúng trường tongTienTamTinh từ API */}
                                        <td className="p-4 font-bold text-blue-600 text-right">
                                            {formatCurrency(item.tongTienTamTinh)}
                                        </td>
                                        
                                        {/* Hiển thị đúng trường trangthaidonhang */}
                                        <td className="p-4 text-center">
                                            {getStatusBadge(item.trangthaidonhang)}
                                        </td>
                                        
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                {/* Nút Xem chi tiết */}
                                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem chi tiết">
                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                </button>
                                                
                                                {/* Nút Duyệt Đơn */}
                                                {item.trangthaidonhang === 'CHO_XAC_NHAN' && (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(item.iddonhang, 'DANG_DONG_HANG')}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                                                        title="Duyệt đơn hàng"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                                    </button>
                                                )}
                                                
                                                {/* Nút Hủy Đơn */}
                                                {(item.trangthaidonhang !== 'HUY' && item.trangthaidonhang !== 'HOAN_TAT') && (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(item.iddonhang, 'HUY')}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                                                        title="Hủy đơn hàng"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">cancel</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-slate-500 flex flex-col items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">inbox</span>
                                        Chưa có đơn hàng nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}