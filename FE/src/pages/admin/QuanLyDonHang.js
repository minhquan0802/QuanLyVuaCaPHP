import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function QuanLyDonHang() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  // --- State cho Modal Chi Tiết ---
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const APP_BASE_URL = 'https://backendfish.mnhwua.id.vn/api';

  // --- 1. Fetch Dữ liệu (Giữ nguyên) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [ordersRes, usersRes] = await Promise.all([
          fetch(`${APP_BASE_URL}/don-hang`),
          fetch(`${APP_BASE_URL}/nguoi-dung`),
        ]);

        if (!ordersRes.ok || !usersRes.ok)
          throw new Error('Lỗi kết nối server');

        // 1. Xử lý dữ liệu Đơn hàng
        const ordersData = await ordersRes.json();
        let realOrders = [];
        if (ordersData.data && Array.isArray(ordersData.data)) {
          realOrders = ordersData.data;
        } else if (Array.isArray(ordersData)) {
          realOrders = ordersData;
        }

        // Sắp xếp
        const statusPriority = {
          pending: 1,
          processing: 2,
          delivering: 3,
          completed: 4,
          cancelled: 5,
        };

        realOrders.sort((a, b) => {
          const priorityA = statusPriority[a.trang_thai] || 99;
          const priorityB = statusPriority[b.trang_thai] || 99;
          if (priorityA !== priorityB) return priorityA - priorityB;
          return new Date(b.ngay_dat) - new Date(a.ngay_dat);
        });

        setOrders(realOrders);

        // 2. Xử lý dữ liệu Khách hàng
        const usersData = await usersRes.json();
        let realUsers = [];
        if (usersData.data && Array.isArray(usersData.data)) {
          realUsers = usersData.data;
        } else if (Array.isArray(usersData)) {
          realUsers = usersData;
        }

        const userMap = {};
        realUsers.forEach((user) => {
          userMap[user.ma_nguoi_dung] = user.ho_ten;
        });
        setUsers(userMap);
      } catch (error) {
        console.error('Lỗi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 2. Xử lý Xem Chi Tiết ---
  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // --- 3. Cập nhật trạng thái (Giữ nguyên) ---
  const handleUpdateStatus = async (id, newStatus) => {
    const confirmMsg =
      newStatus === 'cancelled'
        ? 'Bạn chắc chắn muốn HỦY đơn này?'
        : newStatus === 'processing'
        ? 'Xác nhận duyệt và đóng gói đơn hàng này?'
        : newStatus === 'completed'
        ? 'Xác nhận đơn hàng đã giao thành công?'
        : newStatus === 'delivering'
        ? 'Xác nhận bàn giao cho đơn vị vận chuyển?'
        : `Chuyển trạng thái sang: ${newStatus}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`${APP_BASE_URL}/don-hang/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ trang_thai: newStatus }),
      });

      if (!res.ok) throw new Error('Cập nhật thất bại');

      setOrders(
        orders.map((ord) =>
          ord.ma_don_hang === id ? { ...ord, trang_thai: newStatus } : ord
        )
      );

      // Nếu đang mở modal chi tiết của đơn này thì cập nhật luôn state modal
      if (selectedOrder && selectedOrder.ma_don_hang === id) {
        setSelectedOrder({ ...selectedOrder, trang_thai: newStatus });
      }

      alert('Cập nhật thành công!');
    } catch (error) {
      alert(error.message);
    }
  };

  // --- Helper Functions (Giữ nguyên) ---
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
            Chờ xử lý
          </span>
        );
      case 'processing':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
            Đang đóng gói
          </span>
        );
      case 'delivering':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
            Đang giao
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
            Hoàn tất
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
            {status}
          </span>
        );
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 đ';
    const num = Number(amount);
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(num);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout title="Quản Lý Đơn Hàng">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm mã đơn, tên khách..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
              <tr>
                <th className="p-4 w-20">ID</th>
                <th className="p-4">Khách Hàng</th>
                <th className="p-4">Ngày Đặt</th>
                <th className="p-4 text-right">Tổng Tiền</th>
                <th className="p-4">Địa Chỉ / Ghi Chú</th>
                <th className="p-4 text-center">Trạng Thái</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-500">
                    Đang tải...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((item) => (
                  <tr
                    key={item.ma_don_hang}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4 font-mono text-slate-500">
                      #{item.ma_don_hang}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">
                        {users[item.ma_nguoi_dung] || 'Khách vãng lai'}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        ID: {item.ma_nguoi_dung}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-600">
                      {formatDate(item.ngay_dat)}
                    </td>
                    <td className="p-4 font-bold text-blue-600 text-right">
                      {formatCurrency(item.tong_tien)}
                    </td>
                    <td className="p-4 text-xs text-slate-500 max-w-[200px]">
                      <div className="truncate" title={item.dia_chi_giao_hang}>
                        <span className="font-semibold">ĐC:</span>{' '}
                        {item.dia_chi_giao_hang}
                      </div>
                      {item.ghi_chu && (
                        <div
                          className="truncate text-slate-400 italic"
                          title={item.ghi_chu}
                        >
                          <span className="font-semibold not-italic">
                            Note:
                          </span>{' '}
                          {item.ghi_chu}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {getStatusBadge(item.trang_thai)}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {/* Nút Xem Chi Tiết */}
                        <button
                          onClick={() => handleViewDetail(item)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            visibility
                          </span>
                        </button>

                        {/* 1. Pending -> Processing (Duyệt đơn) */}
                        {item.trang_thai === 'pending' && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(item.ma_don_hang, 'processing')
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Duyệt đơn"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              inventory_2
                            </span>
                          </button>
                        )}

                        {/* 2. Processing -> Delivering (Giao hàng) - PHẦN BẠN THIẾU */}
                        {item.trang_thai === 'processing' && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(item.ma_don_hang, 'delivering')
                            }
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Giao hàng"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              local_shipping
                            </span>
                          </button>
                        )}

                        {/* 3. Delivering -> Completed (Hoàn tất) */}
                        {item.trang_thai === 'delivering' && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(item.ma_don_hang, 'completed')
                            }
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Hoàn tất"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              check_circle
                            </span>
                          </button>
                        )}

                        {/* 4. Nút Hủy (Chỉ hiện khi chưa hoàn thành/hủy/đang giao) */}
                        {(item.trang_thai === 'pending' ||
                          item.trang_thai === 'processing') && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(item.ma_don_hang, 'cancelled')
                            }
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hủy đơn"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              cancel
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-500">
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL CHI TIẾT ĐƠN HÀNG --- */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] overflow-y-auto ring-1 ring-slate-900/5">
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <span className="material-symbols-outlined">
                    receipt_long
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">
                    Chi tiết đơn hàng #{selectedOrder.ma_don_hang}
                  </h3>
                  <div className="text-xs text-slate-500">
                    {formatDate(selectedOrder.ngay_dat)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="size-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6">
              {/* Thông tin chung */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      person
                    </span>{' '}
                    Khách hàng
                  </h4>
                  <p className="text-sm font-medium text-slate-900">
                    {users[selectedOrder.ma_nguoi_dung] || 'Khách vãng lai'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    ID: {selectedOrder.ma_nguoi_dung}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      local_shipping
                    </span>{' '}
                    Giao hàng
                  </h4>
                  <p className="text-sm text-slate-600">
                    {selectedOrder.dia_chi_giao_hang}
                  </p>
                  {selectedOrder.ghi_chu && (
                    <p className="text-xs text-slate-500 mt-2 italic bg-yellow-50 p-2 rounded border border-yellow-100">
                      Note: {selectedOrder.ghi_chu}
                    </p>
                  )}
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <h4 className="font-bold text-slate-700 mb-3">Sản phẩm đã đặt</h4>
              <div className="border rounded-xl overflow-hidden mb-6">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                    <tr>
                      <th className="p-3">Sản phẩm</th>
                      <th className="p-3 text-center">SL</th>
                      <th className="p-3 text-right">Đơn giá</th>
                      <th className="p-3 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {/* Lưu ý: Backend cần trả về kèm relation chi_tiet_don_hangs */}
                    {selectedOrder.chi_tiet_don_hangs &&
                    selectedOrder.chi_tiet_don_hangs.length > 0 ? (
                      selectedOrder.chi_tiet_don_hangs.map((ct, index) => (
                        <tr key={index}>
                          <td className="p-3">
                            <div className="font-medium text-slate-800">
                              {/* Tên sản phẩm lấy từ relation san_pham */}
                              {ct.san_pham?.ten_san_pham ||
                                `Sản phẩm #${ct.ma_san_pham}`}
                            </div>
                          </td>
                          <td className="p-3 text-center">{ct.so_luong}</td>
                          <td className="p-3 text-right text-slate-600">
                            {formatCurrency(ct.gia_mua)}
                          </td>
                          <td className="p-3 text-right font-medium text-slate-900">
                            {formatCurrency(ct.gia_mua * ct.so_luong)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-4 text-center text-slate-400 italic"
                        >
                          Không có thông tin chi tiết sản phẩm.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold text-slate-800">
                    <tr>
                      <td colSpan="3" className="p-3 text-right">
                        Tổng cộng:
                      </td>
                      <td className="p-3 text-right text-blue-600 text-lg">
                        {formatCurrency(selectedOrder.tong_tien)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Actions Footer trong Modal */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                {/* Pending -> Processing */}
                {selectedOrder.trang_thai === 'pending' && (
                  <>
                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          selectedOrder.ma_don_hang,
                          'cancelled'
                        )
                      }
                      className="px-4 py-2 border border-red-200 text-red-600 rounded-lg font-bold hover:bg-red-50 transition-colors"
                    >
                      Hủy đơn
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          selectedOrder.ma_don_hang,
                          'processing'
                        )
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                    >
                      Duyệt & Đóng gói
                    </button>
                  </>
                )}

                {/* Processing -> Delivering (PHẦN BẠN THIẾU) */}
                {selectedOrder.trang_thai === 'processing' && (
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedOrder.ma_don_hang,
                        'delivering'
                      )
                    }
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      local_shipping
                    </span>
                    Giao cho vận chuyển
                  </button>
                )}

                {/* Delivering -> Completed */}
                {selectedOrder.trang_thai === 'delivering' && (
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedOrder.ma_don_hang, 'completed')
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      check_circle
                    </span>
                    Xác nhận giao thành công
                  </button>
                )}

                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
