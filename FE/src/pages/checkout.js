import Header from '../components/header';
import Footer from '../components/footer';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State lưu thông tin nhập từ ô Input
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: '',
  });

  const momoFormRef = useRef(null);

  // Tạo nội dung đơn hàng
  const paymentDescription = `Thanh toan cho ${formData.fullName} - ${formData.phone}`;
  // --- 1. Load Data ---
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      try {
        const user = JSON.parse(currentUserStr);
        setFormData((prev) => ({
          ...prev,
          fullName: user.ho_ten || '',
          phone: user.so_dien_thoai || '',
          address: user.dia_chi || '',
        }));
      } catch (e) {
        console.error('Lỗi parse user data', e);
      }
    }
    setIsLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = cartItems.length > 0 ? 30000 : 0;
  const total = subtotal + shipping;

  // --- XỬ LÝ ĐẶT HÀNG ---
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert('Giỏ hàng đang trống!');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Vui lòng điền đầy đủ thông tin nhận hàng!');
      return;
    }

    // === CASE 1: MOMO ===
    // if (paymentMethod === 'wallet') {
    //     const confirmPayment = window.confirm(`Xác nhận thanh toán ${total.toLocaleString('vi-VN')}đ qua MoMo?`);
    //     if (!confirmPayment) return;

    //     localStorage.removeItem('cart');
    //     window.dispatchEvent(new Event('storage'));
    //     if (momoFormRef.current) momoFormRef.current.submit();
    //     return;
    // }

    if (paymentMethod === 'wallet') {
      const confirmPayment = window.confirm(
        `Xác nhận thanh toán ${total.toLocaleString('vi-VN')}đ qua MoMo?`
      );
      if (!confirmPayment) return;
      window.dispatchEvent(new Event('storage'));
      momoFormRef.current?.submit();
      return;
    }

    // === CASE 2: VNPAY (MỚI THÊM) ===
    if (paymentMethod === 'vnpay') {
      const confirm = window.confirm(
        `Xác nhận thanh toán ${total.toLocaleString()}đ qua VNPAY?`
      );
      if (!confirm) return;

      setIsLoading(true);
      try {
        const userId = localStorage.getItem('user_id');
        const res = await fetch(
          'https://backendfish.mnhwua.id.vn/api/vnpay_payment',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              total_vnpay: total,
              order_info: paymentDescription,
              order_data: {
                ma_nguoi_dung: userId ? parseInt(userId) : null,
                dia_chi_giao_hang: formData.address,
                ghi_chu: paymentDescription,
                chi_tiet: cartItems.map((item) => ({
                  ma_san_pham: item.id,
                  so_luong: item.quantity,
                })),
              },
            }),
          }
        );

        const data = await res.json();
        console.log('VNPAY Response:', data);

        if (data.code === '00' && data.data) {
          window.location.href = data.data;
        } else {
          alert('Lỗi tạo giao dịch VNPAY');
        }
      } catch (error) {
        console.error('Lỗi:', error);
        alert('Không kết nối được server.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // === CASE 3: COD ===
    const confirmCod = window.confirm('Xác nhận đặt hàng (COD)?');
    if (!confirmCod) return;

    setIsLoading(true);
    try {
      const userId = localStorage.getItem('user_id');
      const payload = {
        ma_nguoi_dung: userId ? parseInt(userId) : null,
        dia_chi_giao_hang: `${formData.address} (Người nhận: ${formData.fullName}, SĐT: ${formData.phone})`,
        ghi_chu: formData.note || '',
        chi_tiet: cartItems.map((item) => ({
          ma_san_pham: parseInt(item.id),
          so_luong: parseInt(item.quantity),
        })),
      };

      const res = await fetch('https://backendfish.mnhwua.id.vn/api/don-hang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('storage'));
        alert('Đặt hàng thành công!');
        navigate('/home');
      } else {
        throw new Error(data.message || 'Lỗi server');
      }
    } catch (error) {
      alert('Đặt hàng thất bại: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang xử lý...
      </div>
    );

  if (cartItems.length === 0) {
    return (
      /* ... Giữ nguyên code giỏ hàng trống của bạn ... */
      <div className="bg-slate-50 min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
              shopping_cart_off
            </span>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">
              Giỏ hàng trống
            </h2>
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Quay lại mua sắm
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 font-body text-slate-600 min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center justify-center size-10 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-blue-900 leading-tight">
              Thanh toán
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            {/* LEFT: Form nhập liệu */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Shipping Info giữ nguyên */}
              <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center size-10 rounded-full bg-blue-50 text-blue-600">
                    <span className="material-symbols-outlined">
                      person_pin_circle
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-blue-900">
                    Thông tin nhận hàng
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 outline-none"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 outline-none"
                      placeholder="09xxxxxxxx"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700">
                      Địa chỉ giao hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 outline-none"
                      placeholder="Số nhà, tên đường..."
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700">
                      Ghi chú (Tùy chọn)
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 outline-none h-24 resize-none"
                      placeholder="Ghi chú..."
                    />
                  </div>
                </div>
              </section>

              {/* Payment Method - THÊM VNPAY Ở ĐÂY */}
              <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center size-10 rounded-full bg-blue-50 text-blue-600">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <h2 className="text-xl font-bold text-blue-900">
                    Phương thức thanh toán
                  </h2>
                </div>
                <div className="flex flex-col gap-4">
                  {/* 1. COD */}
                  <label
                    className={`relative flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="size-5 text-blue-600"
                    />
                    <div className="flex-1">
                      <span className="block font-bold text-slate-800">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-2xl text-slate-400">
                      local_shipping
                    </span>
                  </label>

                  {/* 2. MoMo */}
                  <label
                    className={`relative flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'wallet'
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="wallet"
                      checked={paymentMethod === 'wallet'}
                      onChange={() => setPaymentMethod('wallet')}
                      className="size-5 text-pink-600"
                    />
                    <div className="flex-1">
                      <span className="block font-bold text-slate-800">
                        Ví MoMo
                      </span>
                    </div>
                    <img
                      className="h-8 rounded object-contain"
                      src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                      alt="Momo"
                    />
                  </label>

                  {/* 3. VNPAY (MỚI THÊM) */}
                  <label
                    className={`relative flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'vnpay'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="vnpay"
                      checked={paymentMethod === 'vnpay'}
                      onChange={() => setPaymentMethod('vnpay')}
                      className="size-5 text-blue-700"
                    />
                    <div className="flex-1">
                      <span className="block font-bold text-slate-800">
                        VNPAY-QR
                      </span>
                      <span className="text-sm text-slate-500">
                        Thanh toán qua ứng dụng ngân hàng
                      </span>
                    </div>
                    <img
                      className="h-8 rounded object-contain"
                      src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746013_1566974273.png"
                      alt="VNPAY"
                    />
                  </label>
                </div>
              </section>
            </div>

            {/* RIGHT: Tổng tiền */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-lg ring-1 ring-blue-100 border-t-4 border-blue-600">
                <h3 className="font-display text-xl font-bold text-blue-900 mb-6">
                  Đơn hàng của bạn
                </h3>
                <div className="flex flex-col gap-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-start gap-3 py-2 border-b border-dashed border-slate-200 last:border-0"
                    >
                      <div className="size-14 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        <img
                          className="w-full h-full object-cover"
                          src={item.image}
                          alt={item.name}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          SL: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-blue-600 text-sm">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-dashed border-slate-300">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Tạm tính</span>
                    <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Vận chuyển</span>
                    <span>{shipping.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between pt-3 mt-2 border-t border-slate-200">
                    <span className="font-bold text-blue-900">Tổng cộng</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {total.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                  className="w-full mt-8 py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 transition-all"
                >
                  {paymentMethod === 'wallet'
                    ? 'Thanh toán MoMo'
                    : paymentMethod === 'vnpay'
                    ? 'Thanh toán VNPAY'
                    : 'Đặt Hàng Ngay'}
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      {/* Form ẩn Momo */}
      <form
        ref={momoFormRef}
        action="https://backendfish.mnhwua.id.vn/api/momo_payment"
        method="POST"
        className="hidden"
      >
        <input type="hidden" name="total_momo" value={total} />
        <input
          type="hidden"
          name="order_info_momo"
          value={paymentDescription}
        />
        <input type="hidden" name="payUrl" value="Thanh toán MOMO" />
      </form>
    </div>
  );
}
