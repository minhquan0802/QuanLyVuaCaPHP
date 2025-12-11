import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const isCalled = useRef(false);
  const navigate = useNavigate();

  const [status, setStatus] = useState({
    isSuccess: false,
    message: '',
    amount: 0,
    orderInfo: '',
  });

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    // Nếu đã xử lý rồi thì bỏ qua (Tránh React 18 render 2 lần)
    if (isCalled.current) return;

    // === CASE 1: XỬ LÝ MOMO (GIỮ NGUYÊN) ===
    if (params.signature && params.resultCode) {
      isCalled.current = true;

      setStatus({
        isSuccess: params.resultCode === '0',
        message: params.message,
        amount: params.amount,
        orderInfo: params.orderInfo,
      });

      if (params.resultCode === '0') {
        const saveOrderMomo = async () => {
          const cart = JSON.parse(localStorage.getItem('cart')) || [];
          const currentUser =
            JSON.parse(localStorage.getItem('currentUser')) || {};
          const userId = localStorage.getItem('user_id');

          const orderData = {
            ma_nguoi_dung: userId ? parseInt(userId) : null,
            dia_chi_giao_hang: `${currentUser.dia_chi || ''} (Người nhận: ${
              currentUser.ho_ten || ''
            }, SĐT: ${currentUser.so_dien_thoai || ''})`,
            ghi_chu: 'Thanh toán qua MoMo',
            chi_tiet: cart.map((item) => ({
              ma_san_pham: parseInt(item.id),
              so_luong: parseInt(item.quantity),
            })),
          };

          try {
            const res = await fetch(
              'https://backendfish.mnhwua.id.vn/api/save-momo-transaction',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...params,
                  order_data: orderData,
                }),
              }
            );

            if (res.ok) {
              console.log('Đã lưu đơn hàng MoMo thành công!');
              localStorage.removeItem('cart');
              window.dispatchEvent(new Event('storage'));
            }
          } catch (error) {
            console.error('Lỗi lưu đơn hàng MoMo:', error);
          }
        };
        saveOrderMomo();
      }
    }

    // === CASE 2: XỬ LÝ VNPAY (MỚI THÊM) ===
    // VNPAY trả về vnp_ResponseCode
    else if (params.vnp_ResponseCode) {
      isCalled.current = true;

      const isSuccess = params.vnp_ResponseCode === '00';

      // Xử lý hiển thị text (VNPAY trả về dấu + thay cho khoảng trắng)
      // Ví dụ: Thanh+toan+... -> Thanh toan ...
      const rawInfo = params.vnp_OrderInfo || '';
      const decodedInfo = decodeURIComponent(rawInfo.replace(/\+/g, ' '));

      setStatus({
        isSuccess: isSuccess,
        message: isSuccess ? 'Giao dịch thành công' : 'Giao dịch thất bại',
        amount: parseInt(params.vnp_Amount) / 100, // VNPAY nhân 100 nên phải chia 100
        orderInfo: decodedInfo,
      });

      if (isSuccess) {
        const saveOrderVnpay = async () => {
          // 1. Lấy dữ liệu (Giống MoMo)
          const cart = JSON.parse(localStorage.getItem('cart')) || [];
          const currentUser =
            JSON.parse(localStorage.getItem('currentUser')) || {};
          const userId = localStorage.getItem('user_id');

          // 2. Tạo data đơn hàng
          const orderData = {
            ma_nguoi_dung: userId ? parseInt(userId) : null,
            dia_chi_giao_hang: `${currentUser.dia_chi || ''} (Người nhận: ${
              currentUser.ho_ten || ''
            }, SĐT: ${currentUser.so_dien_thoai || ''})`,
            ghi_chu: 'Thanh toán qua VNPAY',
            chi_tiet: cart.map((item) => ({
              ma_san_pham: parseInt(item.id),
              so_luong: parseInt(item.quantity),
            })),
          };

          // 3. Gửi về Backend để kiểm tra chữ ký (SecureHash) và lưu DB
          try {
            const res = await fetch(
              'https://backendfish.mnhwua.id.vn/api/save-vnpay-transaction',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...params, // Gửi toàn bộ params VNPAY về server để check hash
                  order_data: orderData,
                }),
              }
            );

            const data = await res.json();

            if (res.ok && data.code === '00') {
              console.log('Đã lưu đơn hàng VNPAY thành công!');
              localStorage.removeItem('cart');
              window.dispatchEvent(new Event('storage'));
            } else {
              // Nếu Server check chữ ký sai
              setStatus((prev) => ({
                ...prev,
                isSuccess: false,
                message: 'Lỗi xác thực chữ ký!',
              }));
            }
          } catch (error) {
            console.error('Lỗi lưu đơn hàng VNPAY:', error);
          }
        };
        saveOrderVnpay();
      }
    }
  }, [searchParams]);

  return (
    <div className="bg-slate-50 font-body text-slate-600 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-slate-100 max-w-lg w-full text-center">
          <div className="mb-6">
            {status.isSuccess ? (
              <div className="mx-auto flex items-center justify-center size-20 rounded-full bg-green-100 text-green-600">
                <span className="material-symbols-outlined text-5xl">
                  check_circle
                </span>
              </div>
            ) : (
              <div className="mx-auto flex items-center justify-center size-20 rounded-full bg-red-100 text-red-600">
                <span className="material-symbols-outlined text-5xl">
                  cancel
                </span>
              </div>
            )}
          </div>

          <h1
            className={`text-2xl md:text-3xl font-bold mb-2 ${
              status.isSuccess ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {status.isSuccess
              ? 'Thanh toán thành công!'
              : 'Thanh toán thất bại!'}
          </h1>

          <p className="text-slate-500 mb-8">{status.message}</p>

          <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left space-y-3 border border-slate-200">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Nội dung:</span>
              <span className="font-medium text-slate-800 text-right line-clamp-2 ml-4">
                {status.orderInfo}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tổng tiền:</span>
              <span className="font-bold text-blue-600 text-lg">
                {Number(status.amount).toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/home')}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
