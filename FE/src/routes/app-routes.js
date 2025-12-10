import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/login';
import Home from '../pages/home';
import ProductDetail from '../pages/product-detail';
import Cart from '../pages/cart';
import Checkout from '../pages/checkout';
import Register from '../pages/register';
import UserProfile from '../pages/UserProfile';
import PaymentResult from '../pages/PaymentResult';
import ForgotPassword from '../pages/ForgotPassword';
import TheoDoiDonHang from '../pages/TheoDoiDonHang';
// Import các trang Admin
import AdminDashboard from '../pages/admin/AdminDashboard'; 
import QuanLySanPham from '../pages/admin/QuanLySanPham';
import QuanLyTaiKhoan from '../pages/admin/QuanLyTaiKhoan';
import QuanLyDonHang from '../pages/admin/QuanLyDonHang';
import QuanLyDanhMuc from '../pages/admin/QuanLyDanhMuc';

import AdminRoute from './AdminRoute';

import GoogleCallback from '../pages/GoogleCallback';
import ResetPassword from '../pages/ResetPassword';


export default function AppRoutes() {
    return (
        <Routes>
            {/* --- Public Routes --- */}
            <Route path='/' element={<Login />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/register' element={<Register />} />
            <Route path='/home' element={<Home />} />
            
            {/* Product Routes */}
            <Route path='/product-detail' element={<ProductDetail />} /> 
            <Route path='/product-detail/:product_id' element={<ProductDetail />} />
            
            {/* Cart & Checkout */}
            <Route path='/cart' element={<Cart />} />
            <Route path='/checkout' element={<Checkout />} />
            
            {/* User Profile */}
            <Route path='/profile' element={<UserProfile />} />
            <Route path="/payment-result" element={<PaymentResult />} />
            <Route path="/theodoidonhang" element={<TheoDoiDonHang />} />

            <Route path="/auth/google/callback" element={<GoogleCallback />} />

            {/* --- PROTECTED ADMIN ROUTES --- */}
            {/* Tất cả các Route nằm trong cặp thẻ này đều sẽ bị kiểm tra bởi AdminRoute */}
            <Route element={<AdminRoute />}>
                
                {/* Khi vào /admin thì hiện Dashboard */}
                <Route path='/admin' element={<Navigate to="/admin/dashboard" />} /> 
                {/* (Hoặc dùng dòng dưới nếu bạn muốn giữ link /admin) */}
                {/* <Route path='/admin' element={<AdminDashboard />} /> */}

                <Route path='/admin/dashboard' element={<AdminDashboard />} />
                <Route path='/admin/QuanLySanPham' element={<QuanLySanPham />} />
                <Route path='/admin/QuanLyTaiKhoan' element={<QuanLyTaiKhoan />} />
                <Route path='/admin/QuanLyDonHang' element={<QuanLyDonHang />} />
                <Route path='/admin/QuanLyDanhMuc' element={<QuanLyDanhMuc />} />
                
            </Route>

        </Routes>
    )
}