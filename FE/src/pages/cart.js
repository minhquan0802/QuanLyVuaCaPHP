import Header from "../components/header"
import Footer from "../components/footer"
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Cart() {

    const navigate = useNavigate();
    
    const handleCheckout=()=>{
        navigate('/checkout')
    }

    const handleHome=()=>{
        navigate('/home')
    }

    // --- Khởi tạo state từ LocalStorage ---
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Hàm cập nhật số lượng
    const updateQuantity = (id, change) => {
        setCartItems(items => {
            const newItems = items.map(item =>
                item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
            );
            localStorage.setItem('cart', JSON.stringify(newItems));
            return newItems;
        });
    };

    // Hàm xóa sản phẩm
    const removeItem = (id) => {
        setCartItems(items => {
            const newItems = items.filter(item => item.id !== id);
            localStorage.setItem('cart', JSON.stringify(newItems));
            return newItems;
        });
    };

    // Tính toán tổng tiền
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cartItems.length > 0 ? 30000 : 0;
    const total = subtotal + shipping;

    return (
        <div className="bg-slate-50 font-body text-slate-600 min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">

                    {/* Page Header */}
                    <div className="mb-10">
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-blue-900 leading-tight">
                            Giỏ hàng của bạn
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Bạn có <span className="font-bold text-blue-600">{cartItems.length} sản phẩm</span> trong giỏ hàng.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 items-start">

                        {/* Cart List Section */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            
                            {/* --- CẬP NHẬT 1: Chia lại cột Header (Tỷ lệ 6 - 2 - 1 - 2 - 1) --- */}
                            {/* Tăng cột sản phẩm lên 6, giảm cột Giá xuống 1 để cân đối */}
                            {cartItems.length > 0 && (
                                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 text-sm font-bold text-slate-400 uppercase tracking-wider">
                                    <div className="col-span-6">Sản phẩm</div>
                                    <div className="col-span-2 text-center">Số lượng</div>
                                    <div className="col-span-1 text-right">Giá</div>
                                    <div className="col-span-2 text-right">Tổng</div>
                                    <div className="col-span-1 text-center">Xóa</div>
                                </div>
                            )}

                            {/* Cart Items List */}
                            <div className="flex flex-col gap-4">
                                {cartItems.length === 0 ? (
                                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                                        <p className="text-slate-500">Giỏ hàng của bạn đang trống</p>
                                        <button onClick={handleHome} className="mt-4 px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">
                                            Mua sắm ngay
                                        </button>
                                    </div>
                                ) : (
                                    cartItems.map((item) => (
                                        <div key={item.id} className="group relative flex flex-col md:grid md:grid-cols-12 gap-4 md:items-center bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-all duration-300">

                                            {/* Product Info (Đổi thành 6 cols) */}
                                            <div className="col-span-6 flex items-center gap-4">
                                                <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="pr-8 md:pr-0">
                                                    <h3 className="font-display font-bold text-blue-900 text-lg leading-tight">{item.name}</h3>
                                                    <p className="text-sm text-slate-400 mt-1 line-clamp-1">{item.desc}</p>
                                                    <div className="md:hidden mt-2 font-bold text-blue-600">
                                                        {item.price.toLocaleString('vi-VN')}đ
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quantity (2 cols) */}
                                            <div className="col-span-2 flex items-center justify-start md:justify-center mt-2 md:mt-0">
                                                <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="size-8 flex items-center justify-center rounded-md hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors">
                                                        <span className="material-symbols-outlined text-sm">remove</span>
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-bold text-blue-900">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="size-8 flex items-center justify-center rounded-md hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors">
                                                        <span className="material-symbols-outlined text-sm">add</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Unit Price (Đổi thành 1 col) */}
                                            <div className="hidden md:block col-span-1 text-right text-sm text-slate-500">
                                                {item.price.toLocaleString('vi-VN')}đ
                                            </div>

                                            {/* Total Price (2 cols) */}
                                            <div className="col-span-2 flex items-center justify-between md:justify-end gap-2 border-t md:border-0 border-slate-100 pt-4 md:pt-0 mt-2 md:mt-0">
                                                <span className="md:hidden text-sm font-medium text-slate-500">Thành tiền:</span>
                                                <span className="font-bold text-blue-600 text-lg">
                                                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                                </span>
                                            </div>

                                            {/* Remove Button (1 col) */}
                                            <div className="col-span-1 flex justify-center">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="absolute top-4 right-4 md:static size-8 flex items-center justify-center rounded-full text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                                                    title="Xóa sản phẩm"
                                                >
                                                    <span className="material-symbols-outlined text-xl">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Order Summary (Giữ nguyên) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <h2 className="font-display text-xl font-bold text-blue-900 mb-6">Tóm tắt đơn hàng</h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Tạm tính</span>
                                        <span className="font-medium text-slate-700">{subtotal.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Phí vận chuyển</span>
                                        <span className="font-medium text-slate-700">{shipping.toLocaleString('vi-VN')}đ</span>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <div className="flex justify-between items-end">
                                            <span className="font-bold text-blue-900">Tổng cộng</span>
                                            <span className="font-display text-2xl font-bold text-blue-600">{total.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2 text-right">(Đã bao gồm VAT)</p>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <button onClick={handleCheckout} className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all duration-300">
                                        Tiến hành thanh toán
                                    </button>
                                    <button onClick={handleHome} className="w-full py-3.5 rounded-xl border border-blue-200 text-blue-600 font-bold hover:bg-blue-50 transition-colors">
                                        Tiếp tục mua sắm
                                    </button>
                                </div>

                                {/* Trust Badges */}
                                <div className="mt-8 grid grid-cols-3 gap-2 pt-6 border-t border-slate-100">
                                    <div className="flex flex-col items-center gap-1 text-center">
                                        <span className="material-symbols-outlined text-blue-500 text-2xl">verified_user</span>
                                        <span className="text-[10px] text-slate-400">Bảo mật 100%</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 text-center">
                                        <span className="material-symbols-outlined text-blue-500 text-2xl">local_shipping</span>
                                        <span className="text-[10px] text-slate-400">Giao siêu tốc</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 text-center">
                                        <span className="material-symbols-outlined text-blue-500 text-2xl">published_with_changes</span>
                                        <span className="text-[10px] text-slate-400">Đổi trả 24h</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}