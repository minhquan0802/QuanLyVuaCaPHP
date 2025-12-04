import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // --- CODE MỚI: State lưu số lượng giỏ hàng ---
    const [cartCount, setCartCount] = useState(0);

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { label: "Trang chủ", path: "/home" },
        { label: "Sản phẩm", path: "/product-list" },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    // --- CODE MỚI: Hàm tính tổng số lượng từ LocalStorage ---
    useEffect(() => {
        const updateCartCount = () => {
            // 1. Lấy giỏ hàng
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // 2. Tính tổng số lượng (Cộng dồn quantity của từng món)
            // Ví dụ: Mua 2 cá + 3 tôm = 5
            const total = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
            
            setCartCount(total);
        };

        // Gọi hàm ngay khi Header hiện lên
        updateCartCount();

        // Cập nhật mỗi giây (để khi bấm thêm giỏ hàng thì số nhảy ngay)
        const intervalId = setInterval(updateCartCount, 500);

        // Lắng nghe sự kiện storage (khi mở tab khác thay đổi giỏ hàng)
        window.addEventListener('storage', updateCartCount);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('storage', updateCartCount);
        };
    }, [location.pathname]); // Cập nhật lại mỗi khi chuyển trang

    return (
        <>
            {/* Header Container - Floating Style */}
            <header className="fixed top-0 left-0 right-0 z-50 w-full px-0 sm:px-0 lg:px-0">
                <div className="mx-auto max-w-7xl">
                    {/* Main Bar: bg-blue-600 */}
                    <div className="relative flex items-center justify-between rounded-2xl bg-blue-600 shadow-xl shadow-blue-200 ring-1 ring-white/10 transition-all duration-300 px-6 py-3 mt-4 mx-4 md:mx-4 lg:mx-auto">

                        {/* 1. LOGO SECTION */}
                        <div
                            onClick={() => handleNavigation('/home')}
                            className="flex items-center gap-3 cursor-pointer group select-none"
                        >
                            <div className="relative flex items-center justify-center size-10 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                                <span className="material-symbols-outlined text-3xl text-white transition-colors duration-300">phishing</span>
                            </div>
                            <h2 className="font-display text-xl md:text-2xl font-bold text-white tracking-tight">
                               Minh Mạnh Quân Fresh
                            </h2>
                        </div>

                        {/* 2. DESKTOP NAVIGATION */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`relative text-sm font-medium transition-colors duration-300 ${isActive(item.path)
                                        ? "text-white font-bold" // Active
                                        : "text-blue-100 hover:text-white" // Inactive
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        {/* 3. ACTIONS (Account, Cart & Mobile Menu) */}
                        <div className="flex items-center gap-3">
                            
                            {/* --- MỤC TÀI KHOẢN --- */}
                            <button
                                onClick={() => handleNavigation('/profile')}
                                className="hidden md:flex items-center justify-center size-10 rounded-full text-white hover:bg-white/20 transition-all duration-300 group"
                                title="Tài khoản"
                            >
                                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">person</span>
                            </button>

                            {/* Cart Button */}
                            <button
                                onClick={() => handleNavigation('/cart')}
                                className="relative flex items-center justify-center size-10 rounded-full bg-white text-blue-600 shadow-md hover:bg-blue-50 hover:text-blue-700 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                                
                                {/* --- CODE MỚI: Badge count (Chỉ hiện khi > 0) --- */}
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-blue-600 animate-in zoom-in duration-300">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Mobile Hamburger Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden flex items-center justify-center size-10 rounded-full text-white hover:bg-white/10 transition-colors"
                            >
                                <span className="material-symbols-outlined">
                                    {isMobileMenuOpen ? 'close' : 'menu'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* 4. MOBILE MENU DROPDOWN */}
                    {isMobileMenuOpen && (
                        <div className="absolute top-full left-4 right-4 mt-2 p-4 rounded-xl bg-white shadow-xl border border-gray-100 md:hidden animate-in fade-in slide-in-from-top-5 duration-200">
                            <nav className="flex flex-col gap-2">
                                {navItems.map((item) => (
                                    <button
                                        key={item.path}
                                        onClick={() => handleNavigation(item.path)}
                                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                            isActive(item.path)
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                                <div className="h-px bg-gray-100 my-1"></div>
                                {/* Mobile Account Link */}
                                <button
                                    onClick={() => handleNavigation('/profile')}
                                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-3"
                                >
                                    <span className="material-symbols-outlined text-gray-400">person</span>
                                    Tài khoản
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </header>
            
            {/* Spacer */}
            <div className="h-24"></div>
        </>
    );
}