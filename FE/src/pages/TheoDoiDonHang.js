import Header from '../components/header';
import Footer from '../components/footer';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TheoDoiDonHang() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // Mặc định hiển thị tất cả
  const navigate = useNavigate();

  const APP_BASE_URL = 'https://backendfish.mnhwua.id.vn/api';

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ xác nhận', icon: 'assignment_late' }, // pending
    { id: 'processing', label: 'Đang xử lý', icon: 'inventory_2' }, // processing (Đóng gói)
    { id: 'delivering', label: 'Đang giao hàng', icon: 'local_shipping' }, // delivering
    { id: 'completed', label: 'Hoàn thành', icon: 'task_alt' }, // completed
    { id: 'cancelled', label: 'Đã hủy', icon: 'cancel' }, // cancelled
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-orange-600 border-orange-200 bg-orange-50';
      case 'processing':
        return 'text-blue-600 border-blue-200 bg-blue-50';
      case 'delivering':
        return 'text-purple-600 border-purple-200 bg-purple-50';
      case 'completed':
        return 'text-green-600 border-green-200 bg-green-50';
      case 'cancelled':
        return 'text-red-600 border-red-200 bg-red-50';
      default:
        return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  // Helper lấy nhãn tiếng Việt từ ID
  const getStatusLabel = (status) => {
    const tab = tabs.find((t) => t.id === status);
    return tab ? tab.label : status;
  };

  // --- 2. LOAD DỮ LIỆU ---
  const fetchOrders = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      navigate('/');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${APP_BASE_URL}/don-hang?ma_nguoi_dung=${userId}`
      );
      const data = await res.json();

      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Lỗi tải đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [navigate]);

  // --- 3. XỬ LÝ HÀNH ĐỘNG ---
  const handleUpdateStatus = async (orderId, newStatus) => {
    const confirmMsg =
      newStatus === 'cancelled'
        ? 'Bạn có chắc chắn muốn hủy đơn hàng này?'
        : 'Xác nhận bạn đã nhận được hàng?';

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`${APP_BASE_URL}/don-hang/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ trang_thai: newStatus }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert(
          newStatus === 'cancelled'
            ? 'Đã hủy đơn hàng thành công'
            : 'Cảm ơn bạn đã mua hàng!'
        );
        fetchOrders();
      } else {
        alert(result.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      alert('Lỗi kết nối server');
    }
  };

  // --- 4. LỌC DANH SÁCH THEO TAB ---
  const filteredOrders =
    activeTab === 'all'
      ? orders
      : orders.filter((order) => order.trang_thai === activeTab);

  const getCount = (statusId) => {
    if (statusId === 'all') return orders.length;
    return orders.filter((o) => o.trang_thai === statusId).length;
  };

  if (loading)
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="bg-slate-50 font-body text-slate-600 min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-display text-2xl font-bold text-blue-900 mb-6">
            Đơn mua
          </h1>

          {/* --- TAB NAVIGATION (THANH TRẠNG THÁI) --- */}
          <div className="bg-white sticky top-[80px] z-30 shadow-sm rounded-t-lg border-b border-gray-200 overflow-x-auto custom-scrollbar">
            <div className="flex min-w-max">
              {tabs.map((tab) => {
                const count = getCount(tab.id);
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                                            flex-1 px-4 py-4 text-sm font-medium text-center whitespace-nowrap border-b-2 transition-all duration-200 flex items-center justify-center gap-2
                                            ${
                                              isActive
                                                ? 'border-orange-500 text-orange-600' // Active: Màu cam
                                                : 'border-transparent text-slate-600 hover:text-orange-500'
                                            }
                                        `}
                  >
                    {/* Icon (Ẩn trên mobile nếu cần gọn) */}
                    {tab.id !== 'all' && (
                      <span className="material-symbols-outlined text-[18px]">
                        {tab.icon}
                      </span>
                    )}

                    {tab.label}

                    {/* Số lượng đơn */}
                    {count > 0 && tab.id !== 'all' && (
                      <span className="ml-1 text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* --- DANH SÁCH ĐƠN HÀNG --- */}
          <div className="space-y-4 mt-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-b-lg shadow-sm border border-t-0 border-gray-200">
                <div className="mx-auto size-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-4xl text-slate-300">
                    receipt_long
                  </span>
                </div>
                <p className="text-slate-500">
                  Chưa có đơn hàng nào trong mục này
                </p>
                <button
                  onClick={() => navigate('/home')}
                  className="mt-4 text-blue-600 font-bold hover:underline"
                >
                  Mua sắm ngay
                </button>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.ma_don_hang}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Header Card */}
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <div className="text-sm text-slate-500">
                      Mã đơn:{' '}
                      <span className="font-bold text-slate-700">
                        #{order.ma_don_hang}
                      </span>
                      <span className="mx-2">|</span>
                      {new Date(order.ngay_dat).toLocaleString('vi-VN')}
                    </div>
                    <div
                      className={`px-3 py-1 rounded text-xs font-bold uppercase border ${getStatusColor(
                        order.trang_thai
                      )}`}
                    >
                      {getStatusLabel(order.trang_thai)}
                    </div>
                  </div>

                  {/* Body: Danh sách sản phẩm */}
                  <div className="divide-y divide-gray-100">
                    {order.chi_tiet_don_hangs?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 flex gap-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="size-20 border border-gray-200 rounded flex-shrink-0 overflow-hidden bg-white">
                          <img
                            src={
                              item.san_pham?.hinh_anh ||
                              'https://placehold.co/100'
                            }
                            alt={item.san_pham?.ten_san_pham}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-800 font-medium line-clamp-2 mb-1">
                            {item.san_pham?.ten_san_pham}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Số lượng: x{item.so_luong}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="block text-orange-600 font-bold">
                            {Number(item.gia_mua).toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer: Tổng tiền & Nút bấm */}
                  <div className="bg-orange-50/20 p-6 border-t border-gray-100">
                    <div className="flex justify-end items-center gap-2 mb-4">
                      <span className="text-sm text-gray-600">
                        Tổng số tiền:
                      </span>
                      <span className="text-xl font-bold text-orange-600">
                        {Number(order.tong_tien).toLocaleString('vi-VN')}đ
                      </span>
                    </div>

                    <div className="flex justify-end gap-3">
                      {/* Logic nút bấm theo nghiệp vụ */}

                      {/* Nút Hủy: Chỉ hiện khi Pending */}
                      {order.trang_thai === 'pending' && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(order.ma_don_hang, 'cancelled')
                          }
                          className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors"
                        >
                          Hủy đơn hàng
                        </button>
                      )}

                      {/* Nút Nhận hàng: Chỉ hiện khi Delivering */}
                      {order.trang_thai === 'delivering' && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(order.ma_don_hang, 'completed')
                          }
                          className="px-6 py-2 bg-orange-600 text-white font-medium rounded hover:bg-orange-700 transition-colors shadow-sm"
                        >
                          Đã nhận được hàng
                        </button>
                      )}

                      {/* Nút Mua lại: Hiện khi Completed hoặc Cancelled */}
                      {(order.trang_thai === 'completed' ||
                        order.trang_thai === 'cancelled') && (
                        <button
                          onClick={() => navigate('/home')}
                          className="px-6 py-2 bg-orange-600 text-white font-medium rounded hover:bg-orange-700 transition-colors shadow-sm"
                        >
                          Mua lại
                        </button>
                      )}

                      {/* Nút Xem chi tiết (Mặc định cho mọi trạng thái) */}
                      <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors">
                        Liên hệ Shop
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
