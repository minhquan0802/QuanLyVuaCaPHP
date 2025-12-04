import Header from "../components/header"
import Footer from "../components/footer"
import { useState, useEffect, useRef } from "react" // Thêm useRef
import { useNavigate } from "react-router-dom"

export default function Checkout() {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Tạo Ref để điều khiển form ẩn
    const momoFormRef = useRef(null);

    // Load dữ liệu giỏ hàng từ LocalStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
        setIsLoading(false);
    }, []);

    // Tính toán tiền
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cartItems.length > 0 ? 30000 : 0;
    const total = subtotal + shipping;

    // Xử lý đặt hàng
    const handlePlaceOrder = () => {
        if (cartItems.length === 0) {
            alert("Giỏ hàng đang trống!");
            return;
        }

        // --- TRƯỜNG HỢP 1: THANH TOÁN MOMO (Dùng Form Submit) ---
        if (paymentMethod === 'wallet') {
            const confirmPayment = window.confirm(`Xác nhận thanh toán ${total.toLocaleString('vi-VN')}đ qua MoMo?`);
            if (!confirmPayment) return;

            // Xóa giỏ hàng trước khi chuyển hướng (Hoặc bạn có thể xử lý xóa sau khi thanh toán thành công)
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('storage'));

            // Submit form ẩn -> Trình duyệt sẽ tự chuyển hướng sang trang MoMo
            if (momoFormRef.current) {
                momoFormRef.current.submit();
            }
            return;
        }

        // --- TRƯỜNG HỢP 2: THANH TOÁN COD (Mặc định) ---
        localStorage.removeItem('cart');
        alert("Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Minh Mạnh Quân Fresh.");
        navigate('/home');
        window.dispatchEvent(new Event('storage'));
    };

    if (isLoading) return null;

    // Nếu giỏ hàng trống...
    if (cartItems.length === 0) {
        return (
            <div className="bg-slate-50 min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex flex-col items-center justify-center p-4">
                    <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">shopping_cart_off</span>
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Giỏ hàng trống</h2>
                        <p className="text-slate-500 mb-6">Vui lòng thêm sản phẩm vào giỏ trước khi thanh toán.</p>
                        <button onClick={() => navigate('/home')} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
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

                    {/* Page Title */}
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => navigate('/cart')} className="flex items-center justify-center size-10 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-blue-900 leading-tight">
                            Thanh toán
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

                        {/* LEFT COLUMN: Customer Info & Payment */}
                        <div className="lg:col-span-2 flex flex-col gap-8">

                            {/* 1. Shipping Information Card */}
                            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm ring-1 ring-slate-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center justify-center size-10 rounded-full bg-blue-50 text-blue-600">
                                        <span className="material-symbols-outlined">person_pin_circle</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-blue-900">Thông tin nhận hàng</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Họ và tên <span className="text-red-500">*</span></label>
                                        <input
                                            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="Nguyễn Văn A"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
                                        <input
                                            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="09xxxxxxxx"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-slate-700">Địa chỉ giao hàng <span className="text-red-500">*</span></label>
                                        <input
                                            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-slate-700">Ghi chú (Tùy chọn)</label>
                                        <textarea
                                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none h-24 placeholder:text-slate-400"
                                            placeholder="Ví dụ: Giao hàng vào giờ hành chính..."
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* 2. Payment Method Card */}
                            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm ring-1 ring-slate-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center justify-center size-10 rounded-full bg-blue-50 text-blue-600">
                                        <span className="material-symbols-outlined">payments</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-blue-900">Phương thức thanh toán</h2>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {/* COD Option */}
                                    <label
                                        className={`relative flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${paymentMethod === 'cod'
                                                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                                : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={() => setPaymentMethod('cod')}
                                            className="size-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <div className="flex-1">
                                            <span className="block font-bold text-slate-800">Thanh toán khi nhận hàng (COD)</span>
                                            <span className="text-sm text-slate-500">Thanh toán tiền mặt khi giao hàng thành công</span>
                                        </div>
                                        <span className="material-symbols-outlined text-2xl text-slate-400">local_shipping</span>
                                    </label>

                                    {/* Banking/Card Option */}
                                    <label className={`relative flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 opacity-50 cursor-not-allowed border-slate-200 bg-slate-50`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="card"
                                            disabled
                                            className="size-5 text-gray-400 border-gray-300"
                                        />
                                        <div className="flex-1">
                                            <span className="block font-bold text-slate-500">Thẻ Tín dụng (Bảo trì)</span>
                                            <span className="text-sm text-slate-400">Visa, Mastercard</span>
                                        </div>
                                        <div className="flex gap-2 opacity-50">
                                            <img className="h-6 object-contain" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" />
                                        </div>
                                    </label>

                                    {/* E-Wallet Option (MoMo) */}
                                    <label
                                        className={`relative flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${paymentMethod === 'wallet'
                                                ? "border-pink-500 bg-pink-50 ring-1 ring-pink-500"
                                                : "border-slate-200 hover:border-pink-300 hover:bg-slate-50"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="wallet"
                                            checked={paymentMethod === 'wallet'}
                                            onChange={() => setPaymentMethod('wallet')}
                                            className="size-5 text-pink-600 focus:ring-pink-500 border-gray-300"
                                        />
                                        <div className="flex-1">
                                            <span className="block font-bold text-slate-800">Ví MoMo</span>
                                            <span className="text-sm text-slate-500">Quét mã QR để thanh toán</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <img className="h-8 rounded object-contain" src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="Momo" />
                                        </div>
                                    </label>
                                </div>
                            </section>
                        </div>

                        {/* RIGHT COLUMN: Order Summary */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-lg ring-1 ring-blue-100 border-t-4 border-blue-600">
                                <h3 className="font-display text-xl font-bold text-blue-900 mb-6">Đơn hàng của bạn</h3>

                                {/* Product List */}
                                <div className="flex flex-col gap-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                    {cartItems.map((item, index) => (
                                        <div key={`${item.id}-${index}`} className="flex items-start gap-3 py-2 border-b border-dashed border-slate-200 last:border-0">
                                            <div className="size-14 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-800 truncate">{item.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    SL: <span className="font-bold text-slate-700">{item.quantity}</span> x {item.price.toLocaleString('vi-VN')}đ
                                                </p>
                                            </div>
                                            <p className="font-bold text-blue-600 text-sm">
                                                {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Calculations */}
                                <div className="flex flex-col gap-3 pt-4 border-t border-dashed border-slate-300">
                                    <div className="flex justify-between items-center text-sm text-slate-500">
                                        <span>Tạm tính</span>
                                        <span className="font-medium text-slate-700">{subtotal.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-slate-500">
                                        <span>Phí vận chuyển</span>
                                        <span className="font-medium text-slate-700">{shipping.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 mt-2 border-t border-slate-200">
                                        <span className="text-base font-bold text-blue-900">Tổng cộng</span>
                                        <span className="text-2xl font-bold text-blue-600">{total.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button 
                                    onClick={handlePlaceOrder}
                                    className={`w-full mt-8 py-4 rounded-xl text-white font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5
                                        ${paymentMethod === 'wallet' 
                                            ? 'bg-pink-600 hover:bg-pink-700 shadow-pink-200 hover:shadow-pink-300' 
                                            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300'
                                        }`}
                                >
                                    <span className="material-symbols-outlined">
                                        {paymentMethod === 'wallet' ? 'qr_code_2' : 'lock'}
                                    </span>
                                    {paymentMethod === 'wallet' ? "Thanh toán qua MoMo" : "Đặt Hàng Ngay"}
                                </button>

                                <p className="text-[11px] text-center text-slate-400 mt-4 px-2">
                                    Bằng cách đặt hàng, bạn đồng ý với <a href="#" className="underline hover:text-blue-600">Điều khoản</a> và <a href="#" className="underline hover:text-blue-600">Chính sách</a> của chúng tôi.
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />

            {/* --- FORM ẨN ĐỂ SUBMIT SANG LARAVEL/MOMO --- */}
            {/* Form này sẽ mô phỏng hành động submit form HTML thuần túy */}
            <form 
                ref={momoFormRef} 
                action="http://127.0.0.1:8000/api/momo_payment" 
                method="POST" 
                className="hidden"
            >
                {/* Truyền các tham số cần thiết sang Controller */}
                {/* Lưu ý: name="total_momo" phải khớp với $request->total_momo bên Laravel nếu bạn sửa lại controller */}
                {/* Nếu Controller cũ vẫn dùng hardcode $amount = 10000 thì giá trị này gửi đi chưa có tác dụng, bạn cần sửa controller để nhận */}
                <input type="hidden" name="total_momo" value={total} />
                
                {/* Thêm input này để giống form mẫu của bạn, phòng khi backend check */}
                <input type="hidden" name="payUrl" value="Thanh toán MOMO" />
            </form>

        </div>
    )
}