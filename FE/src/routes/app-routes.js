import { Routes, Route } from 'react-router-dom';
import Login from '../pages/login';
import Home from '../pages/home';
import ProductDetail from '../pages/product-detail';
import Cart from '../pages/cart';
import Checkout from '../pages/checkout';
import Register from '../pages/register';
import UserProfile from '../pages/UserProfile';
import PaymentResult from '../pages/PaymentResult';

// CẬP NHẬT QUAN TRỌNG: Import đúng file Dashboard trong thư mục pages/admin
import AdminDashboard from '../pages/admin/AdminDashboard'; 
import QuanLyLoaiCa from '../pages/admin/QuanLyLoaiCa';
import QuanLyTaiKhoan from '../pages/admin/QuanLyTaiKhoan';
import QuanLyDonHang from '../pages/admin/QuanLyDonHang';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/home' element={<Home />} />
            
            {/* Product Routes */}
            {/* Route này để bắt trường hợp vào trang chi tiết mà không có ID (nếu cần) */}
            <Route path='/product-detail' element={<ProductDetail />} /> 
            {/* Route chính thức có ID sản phẩm */}
            <Route path='/product-detail/:product_id' element={<ProductDetail />} />
            
            {/* Cart & Checkout */}
            <Route path='/cart' element={<Cart />} />
            <Route path='/checkout' element={<Checkout />} />
            
            {/* Admin Routes */}
            <Route path='/admin' element={<AdminDashboard />} />
            <Route path='/admin/QuanLyLoaiCa' element={<QuanLyLoaiCa />} />
            <Route path='/admin/QuanLyTaiKhoan' element={<QuanLyTaiKhoan />} />
            <Route path='/admin/QuanLyDonHang' element={<QuanLyDonHang />} />
            
            {/* User Profile */}
            <Route path='/profile' element={<UserProfile />} />
            <Route path="/payment-result" element={<PaymentResult />} />
        </Routes>
    )
}