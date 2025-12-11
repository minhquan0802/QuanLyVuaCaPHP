import { useState, useEffect, useRef } from 'react'; // Thêm useRef
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);

  // --- 1. THÊM STATE & REF CHO DROPDOWN ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Trang chủ', path: '/home' },
    { label: 'Sản phẩm', path: '/product-list' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false); // Đóng dropdown khi chuyển trang
  };

  // --- 2. XỬ LÝ CLICK OUTSIDE ĐỂ ĐÓNG DROPDOWN ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  // --- LOAD DATA (Giữ nguyên code cũ của bạn) ---
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Lỗi parse user:', e);
      }
    }

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

  // --- 3. XỬ LÝ CLICK TÀI KHOẢN ---
  const handleAccountClick = () => {
    if (!user) {
      navigate('/'); // Chưa login thì chuyển trang Login
    } else {
      setIsDropdownOpen(!isDropdownOpen); // Đã login thì toggle dropdown
    }
  };
  const handleProductSearch = (StringValue) => {
    if (StringValue !== '') {
      navigate(`/product-search/${StringValue}`);
      setSearch('');
    } else {
      navigate('/home');
    }
  };
  // --- 4. HÀM ĐĂNG XUẤT (Tùy chọn thêm vào menu) ---
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user_id');
    localStorage.removeItem('cart'); // Tùy chọn xóa giỏ hàng
    setUser(null);
    setIsDropdownOpen(false);
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        <div className="mx-auto max-w-7xl">
          <div className="relative flex items-center justify-between rounded-none sm:rounded-2xl bg-blue-600 shadow-xl shadow-blue-200 ring-1 ring-white/10 transition-all duration-300 px-3 sm:px-6 py-3 sm:mt-4 sm:mx-4 lg:mx-auto">
            {/* LOGO */}
            <div
              onClick={() => handleNavigation('/home')}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none flex-shrink-0"
            >
              <div className="relative flex items-center justify-center size-8 sm:size-10 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                <span className="material-symbols-outlined text-2xl sm:text-3xl text-white transition-colors duration-300">
                  phishing
                </span>
              </div>
              <h2 className="font-display text-sm sm:text-xl md:text-2xl font-bold text-white tracking-tight drop-shadow-[0_0_6px_rgba(165,243,252,0.6)]">
                <span className="hidden sm:inline">Minh Mạnh Quân Fresh</span>
                <span className="sm:hidden">MMQ Fresh</span>
              </h2>
            </div>

            {/* SEARCH BAR - Hidden on mobile, visible on lg+ */}
            <div className="hidden lg:block lg:w-[450px] mx-4">
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-3xl border border-white/20 shadow-2xl">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <span className="material-symbols-outlined text-slate-300 group-focus-within:text-blue-400 transition-colors">
                      search
                    </span>
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && search.trim()) {
                        handleProductSearch(search);
                      }
                    }}
                    className="block w-full pl-12 pr-20 py-3 rounded-2xl border-none bg-white/90 text-slate-900 shadow-sm placeholder:text-slate-500 focus:bg-white focus:ring-0 transition-all"
                    placeholder="Bạn muốn ăn gì hôm nay?"
                  />
                  <button
                    className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/30 flex items-center gap-1"
                    onClick={() => handleProductSearch(search)}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      search
                    </span>
                    <span className="hidden xl:inline">Tìm</span>
                  </button>
                </div>
              </div>
            </div>

            {/* NAV */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
                    isActive(item.path)
                      ? 'text-white font-bold'
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* ACTIONS */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Search icon for mobile/tablet */}
              <button
                onClick={() => navigate('/home')}
                className="lg:hidden flex items-center justify-center size-9 sm:size-10 rounded-full text-white hover:bg-white/20 transition-all duration-300"
                title="Tìm kiếm"
              >
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </button>

              {/* --- 5. NÚT TÀI KHOẢN + DROPDOWN --- */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleAccountClick}
                  className={`hidden sm:flex items-center justify-center size-9 sm:size-10 rounded-full text-white hover:bg-white/20 transition-all duration-300 group ${
                    isDropdownOpen ? 'bg-white/20' : ''
                  }`}
                  title={user ? `Xin chào ${user.ho_ten}` : 'Tài khoản'}
                >
                  <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                    person
                  </span>
                </button>

                {/* DROPDOWN MENU */}
                {isDropdownOpen && user && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in duration-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user.ho_ten}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      {user.role === 'admin' ? (
                        // --- MENU CHO ADMIN ---
                        <button
                          onClick={() => handleNavigation('/admin')}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            dashboard
                          </span>
                          Trang quản trị
                        </button>
                      ) : (
                        // --- MENU CHO KHÁCH HÀNG ---
                        <>
                          <button
                            onClick={() => handleNavigation('/profile')}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              account_circle
                            </span>
                            Thông tin cá nhân
                          </button>
                          <button
                            onClick={() => handleNavigation('/theodoidonhang')}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              receipt_long
                            </span>
                            Theo dõi đơn hàng
                          </button>
                        </>
                      )}

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          logout
                        </span>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Nút Giỏ hàng */}
              <button
                onClick={() => handleNavigation('/cart')}
                className="relative flex items-center justify-center size-9 sm:size-10 rounded-full bg-white text-blue-600 shadow-md hover:bg-blue-50 hover:text-blue-700 hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                  shopping_cart
                </span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex size-4 sm:size-5 items-center justify-center rounded-full bg-red-500 text-[9px] sm:text-[10px] font-bold text-white border-2 border-blue-600 animate-in zoom-in duration-300">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center size-9 sm:size-10 rounded-full text-white hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined">
                  {isMobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 sm:left-4 sm:right-4 mt-0 sm:mt-2 p-4 rounded-none sm:rounded-xl bg-white shadow-xl border-t sm:border border-gray-100 lg:hidden animate-in fade-in slide-in-from-top-5 duration-200 max-h-[calc(100vh-80px)] overflow-y-auto">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="h-px bg-gray-100 my-1"></div>

                {user ? (
                  // Mobile view cho User đã login
                  <>
                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">
                      Tài khoản
                    </div>
                    {user.role === 'admin' ? (
                      <button
                        onClick={() => handleNavigation('/admin')}
                        className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-3"
                      >
                        <span className="material-symbols-outlined text-gray-400">
                          dashboard
                        </span>
                        Quản trị viên
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleNavigation('/profile')}
                          className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <span className="material-symbols-outlined text-gray-400">
                            account_circle
                          </span>
                          Thông tin cá nhân
                        </button>
                        <button
                          onClick={() => handleNavigation('/theodoidonhang')}
                          className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <span className="material-symbols-outlined text-gray-400">
                            receipt_long
                          </span>
                          Theo dõi đơn hàng
                        </button>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3"
                    >
                      <span className="material-symbols-outlined">logout</span>
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  // Mobile view cho Guest
                  <button
                    onClick={() => handleNavigation('/')}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-gray-400">
                      login
                    </span>
                    Đăng nhập
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
      <div className="h-24"></div>
    </>
  );
}
