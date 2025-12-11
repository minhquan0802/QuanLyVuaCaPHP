import AdminLayout from '../../components/admin/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalOrders: 0,
    revenue: 0,
    uniqueCustomers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cấu hình URL API
  const API_URL = 'https://backendfish.mnhwua.id.vn/api/don-hang';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Gọi API lấy danh sách toàn bộ đơn hàng
        // Lưu ý: Backend nên trả về tất cả đơn hàng (hoặc phân trang lớn) để tính toán chính xác
        const res = await fetch(API_URL);
        const responseData = await res.json();

        // Xử lý dữ liệu trả về (hỗ trợ cả trường hợp trả về mảng hoặc object {data: []})
        const orders = Array.isArray(responseData)
          ? responseData
          : responseData.data || [];

        // 1. Tính Tổng Đơn Hàng
        const total = orders.length;

        // 2. Tính Doanh Thu (Chỉ cộng tiền các đơn đã 'completed')
        // Nếu muốn tính doanh thu dự kiến (bao gồm cả processing) thì bỏ điều kiện filter
        const revenue = orders
          .filter((order) => order.trang_thai === 'completed')
          .reduce((sum, order) => sum + Number(order.tong_tien), 0);

        // 3. Tính Số Khách Hàng (Đếm user_id không trùng lặp)
        const uniqueUsers = new Set(orders.map((order) => order.ma_nguoi_dung))
          .size;

        setStats({
          totalOrders: total,
          revenue: revenue,
          uniqueCustomers: uniqueUsers,
        });

        // 4. Lấy 5 đơn hàng mới nhất để hiển thị bảng (Sắp xếp theo ngày giảm dần)
        // Giả sử API trả về field 'created_at' hoặc 'ngay_dat'
        const sortedOrders = [...orders].sort(
          (a, b) =>
            new Date(b.created_at || b.ngay_dat) -
            new Date(a.created_at || a.ngay_dat)
        );
        setRecentOrders(sortedOrders.slice(0, 5));
      } catch (error) {
        console.error('Lỗi lấy dữ liệu dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Hàm format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Hàm hiển thị màu trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // --- CẬP NHẬT: Hàm chuyển đổi trạng thái sang Tiếng Việt ---
  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'processing':
        return 'Đang xử lý';
      case 'pending':
        return 'Chờ xử lý';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status; // Trả về nguyên gốc nếu không khớp
    }
  };

  return (
    <AdminLayout title="Tổng Quan">
      {/* Cards Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Tổng Đơn */}
        <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-600">Tổng Đơn Hàng</h3>
            <span className="material-symbols-outlined text-blue-500 bg-blue-50 p-2 rounded-lg">
              receipt_long
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {loading ? '...' : stats.totalOrders}
          </p>
          <p className="text-sm text-slate-400 mt-2 font-medium flex items-center gap-1">
            Toàn hệ thống
          </p>
        </div>

        {/* Card 2: Doanh Thu */}
        <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-600">Doanh Thu Thực</h3>
            <span className="material-symbols-outlined text-green-500 bg-green-50 p-2 rounded-lg">
              payments
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {loading ? '...' : formatCurrency(stats.revenue)}
          </p>
          <p className="text-sm text-green-600 mt-2 font-medium flex items-center gap-1">
            (Đã hoàn thành)
          </p>
        </div>

        {/* Card 3: Khách Hàng */}
        <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-600">Khách Mua Hàng</h3>
            <span className="material-symbols-outlined text-purple-500 bg-purple-50 p-2 rounded-lg">
              group
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {loading ? '...' : stats.uniqueCustomers}
          </p>
          <p className="text-sm text-purple-500 mt-2 font-medium flex items-center gap-1">
            Người dùng duy nhất
          </p>
        </div>
      </div>

      {/* Bảng Đơn Hàng Mới Nhất (Thay thế khu vực trống) */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">
              new_releases
            </span>
            Đơn Hàng Mới Nhất
          </h3>
          <button
            onClick={() => navigate('/admin/QuanLyDonHang')}
            className="text-sm text-blue-600 font-bold hover:underline"
          >
            Xem tất cả
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Mã ĐH</th>
                <th className="px-6 py-4">Khách Hàng (ID)</th>
                <th className="px-6 py-4">Ngày Đặt</th>
                <th className="px-6 py-4 text-right">Tổng Tiền</th>
                <th className="px-6 py-4 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr
                    key={order.ma_don_hang}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-blue-600">
                      #{order.ma_don_hang}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      User ID: {order.ma_nguoi_dung}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(
                        order.created_at || order.ngay_dat
                      ).toLocaleDateString('vi-VN')}
                      <br />
                      <span className="text-xs">
                        {new Date(
                          order.created_at || order.ngay_dat
                        ).toLocaleTimeString('vi-VN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                      {formatCurrency(order.tong_tien)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {/* --- CẬP NHẬT: Sử dụng hàm getStatusText để hiển thị tiếng Việt --- */}
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(
                          order.trang_thai
                        )}`}
                      >
                        {getStatusText(order.trang_thai)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
