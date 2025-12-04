import Header from "../components/header"
import Footer from "../components/footer"
import ProductList from "../components/product-list"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Home() {
    const navigate = useNavigate();

    // --- LOGIC BẢO VỆ TRANG ---
    useEffect(() => {
        // Kiểm tra xem đã có thông tin đăng nhập trong localStorage chưa
        const userId = localStorage.getItem('user_id');
        
        // Nếu không tìm thấy user_id, đá về trang login
        if (!userId) {
            navigate('/');
        }
    }, [navigate]);

    // (Tùy chọn) Để tránh nhấp nháy giao diện trang chủ trong tíc tắc trước khi chuyển hướng
    // ta có thể return null nếu chưa đăng nhập
    if (!localStorage.getItem('user_id')) {
        return null; 
    }

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
            <Header />
            
            <main className="flex-grow flex flex-col">
                {/* 1. SECTION HEADER & TOOLBAR */}
                <div className="bg-white border-b border-slate-200 shadow-sm mt-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">

                            {/* Title & Description */}
                            <div>
                                <h1 className="font-display text-3xl md:text-4xl font-bold text-blue-900 leading-tight">
                                    Thủy Sản Tươi Sống
                                </h1>
                                <p className="mt-2 text-slate-500 max-w-2xl text-base">
                                    Nguồn hàng tươi ngon mỗi ngày, được tuyển chọn kỹ lưỡng từ những vùng nuôi trồng đạt chuẩn.
                                </p>
                            </div>

                            {/* Search Bar */}
                            <div className="w-full md:w-96">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <span className="material-symbols-outlined text-blue-400 group-focus-within:text-blue-600 transition-colors">search</span>
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-11 pr-4 py-3 rounded-xl border-none bg-slate-100 text-blue-900 shadow-inner ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ease-in-out"
                                        placeholder="Tìm kiếm cá, tôm..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. PRODUCT LIST SECTION */}
                <div className="py-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ProductList/>
                </div>
            </main>

            <Footer />
        </div>
    )
}