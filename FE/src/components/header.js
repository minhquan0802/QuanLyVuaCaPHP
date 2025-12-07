import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // State lưu số lượng giỏ hàng
    const [cartCount, setCartCount] = useState(0);

    // State lưu User
    const [user, setUser] = useState(null);

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { label: "Trang chủ", path: "/home" },
        { label: "Sản phẩm", path: "/product-list" },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    // --- 1. LOAD DATA TỪ LOCAL STORAGE ---
    useEffect(() => {
        // --- SỬA Ở ĐÂY: Dùng key "currentUser" thay vì "user" ---
        const storedUser = localStorage.getItem("currentUser"); 
        
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser); // Lưu vào state để dùng
                console.log("Đã load được user:", parsedUser); // Debug xem load được chưa
            } catch (e) {
                console.error("Lỗi parse user:", e);
            }
        } else {
            console.log("Không tìm thấy currentUser trong LocalStorage");
        }

        // Load & Auto Update Cart Count
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const total = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
            setCartCount(total);
        };

        updateCartCount();
        const intervalId = setInterval(updateCartCount, 500);
        window.addEventListener('storage', updateCartCount);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('storage', updateCartCount);
        };
    }, [location.pathname]); 

    // --- 2. XỬ LÝ CLICK TÀI KHOẢN ---
    const handleAccountClick = () => {
        // Kiểm tra xem đã load được user chưa
        if (!user) {
            console.log("User state đang null -> Chuyển về Login");
            navigate('/'); 
            return;
        }

        console.log("User Role:", user.role); // Debug xem role là gì

        // Kiểm tra Role (dựa trên data mẫu bạn gửi: role là "customer" hoặc "admin")
        if (user.role === 'admin') {
            navigate('/admin'); 
        } else {
            // Trường hợp là 'customer' hoặc role khác
            navigate('/profile'); 
        }
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 w-full px-0 sm:px-0 lg:px-0">
                <div className="mx-auto max-w-7xl">
                    <div className="relative flex items-center justify-between rounded-2xl bg-blue-600 shadow-xl shadow-blue-200 ring-1 ring-white/10 transition-all duration-300 px-6 py-3 mt-4 mx-4 md:mx-4 lg:mx-auto">

                        {/* LOGO */}
                        <div onClick={() => handleNavigation('/home')} className="flex items-center gap-3 cursor-pointer group select-none">
                            <div className="relative flex items-center justify-center size-10 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                                <span className="material-symbols-outlined text-3xl text-white transition-colors duration-300">phishing</span>
                            </div>
                            <h2 className="font-display text-xl md:text-2xl font-bold text-white tracking-tight">
                               Minh Mạnh Quân Fresh
                            </h2>
                        </div>

                        {/* NAV */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`relative text-sm font-medium transition-colors duration-300 ${isActive(item.path) ? "text-white font-bold" : "text-blue-100 hover:text-white"}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-3">
                            
                            {/* Nút Tài khoản */}
                            <button
                                onClick={handleAccountClick}
                                className="hidden md:flex items-center justify-center size-10 rounded-full text-white hover:bg-white/20 transition-all duration-300 group"
                                title={user ? `Xin chào ${user.ho_ten}` : "Tài khoản"}
                            >
                                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">person</span>
                            </button>

                            {/* Nút Giỏ hàng */}
                            <button
                                onClick={() => handleNavigation('/cart')}
                                className="relative flex items-center justify-center size-10 rounded-full bg-white text-blue-600 shadow-md hover:bg-blue-50 hover:text-blue-700 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-blue-600 animate-in zoom-in duration-300">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Mobile Hamburger */}
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden flex items-center justify-center size-10 rounded-full text-white hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                            </button>
                        </div>
                    </div>

                    {/* MOBILE MENU */}
                    {isMobileMenuOpen && (
                        <div className="absolute top-full left-4 right-4 mt-2 p-4 rounded-xl bg-white shadow-xl border border-gray-100 md:hidden animate-in fade-in slide-in-from-top-5 duration-200">
                            <nav className="flex flex-col gap-2">
                                {navItems.map((item) => (
                                    <button key={item.path} onClick={() => handleNavigation(item.path)} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(item.path) ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}>
                                        {item.label}
                                    </button>
                                ))}
                                <div className="h-px bg-gray-100 my-1"></div>
                                <button onClick={handleAccountClick} className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-gray-400">person</span>
                                    {user ? "Tài khoản cá nhân" : "Đăng nhập"}
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </header>
            <div className="h-24"></div>
        </>
    );
}