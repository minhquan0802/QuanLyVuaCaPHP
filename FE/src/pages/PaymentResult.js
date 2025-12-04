import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

export default function PaymentResult() {
    const [searchParams] = useSearchParams();
    const isCalled = useRef(false); // Dùng ref để chặn React gọi API 2 lần (Strict Mode)
    const navigate = useNavigate();
    
    // State để lưu trạng thái kết quả
    const [status, setStatus] = useState({
        isSuccess: false,
        message: "",
        amount: 0,
        orderInfo: ""
    });

    useEffect(() => {
        // 1. Lấy tất cả params từ URL biến thành Object
        // Ví dụ: { partnerCode: "MOMO...", resultCode: "0", ... }
        const params = Object.fromEntries([...searchParams]);

        // Kiểm tra xem có phải là link callback từ MoMo không (có signature và resultCode)
        if (params.signature && params.resultCode && !isCalled.current) {
            
            isCalled.current = true; // Đánh dấu đã gọi để không gọi lại

            // 2. Gửi về Backend lưu
            const saveToDatabase = async () => {
                try {
                    const res = await fetch('http://127.0.0.1:8000/api/save-momo-transaction', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(params) // Gửi nguyên cục params về
                    });

                    const data = await res.json();
                    console.log("Kết quả lưu DB:", data);
                    
                    if (res.ok) {
                        // Xóa giỏ hàng nếu thành công
                        if (params.resultCode === '0') {
                            localStorage.removeItem('cart');
                            window.dispatchEvent(new Event('storage'));
                        }
                    }

                } catch (error) {
                    console.error("Lỗi gọi API:", error);
                }
            };

            saveToDatabase();
        }
    }, [searchParams]);

    return (
        <div className="bg-slate-50 font-body text-slate-600 min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-slate-100 max-w-lg w-full text-center">
                    
                    {/* ICON TRẠNG THÁI */}
                    <div className="mb-6">
                        {status.isSuccess ? (
                            <div className="mx-auto flex items-center justify-center size-20 rounded-full bg-green-100 text-green-600">
                                <span className="material-symbols-outlined text-5xl">check_circle</span>
                            </div>
                        ) : (
                            <div className="mx-auto flex items-center justify-center size-20 rounded-full bg-red-100 text-red-600">
                                <span className="material-symbols-outlined text-5xl">cancel</span>
                            </div>
                        )}
                    </div>

                    {/* TIÊU ĐỀ */}
                    <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${status.isSuccess ? "text-green-600" : "text-red-600"}`}>
                        {status.isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
                    </h1>
                    
                    <p className="text-slate-500 mb-8">
                        {status.message}
                    </p>

                    {/* CHI TIẾT GIAO DỊCH */}
                    <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left space-y-3 border border-slate-200">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Nội dung:</span>
                            <span className="font-medium text-slate-700 truncate max-w-[200px]">{status.orderInfo}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Tổng tiền:</span>
                            <span className="font-bold text-blue-600 text-lg">
                                {Number(status.amount).toLocaleString('vi-VN')}đ
                            </span>
                        </div>
                    </div>

                    {/* BUTTONS NAVIGATION */}
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => navigate('/home')} 
                            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
                        >
                            Về trang chủ
                        </button>
                        
                        {!status.isSuccess && (
                            <button 
                                onClick={() => navigate('/checkout')} 
                                className="w-full py-3 bg-white border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                            >
                                Thử thanh toán lại
                            </button>
                        )}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}