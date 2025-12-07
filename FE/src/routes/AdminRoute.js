import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    // 1. Lấy thông tin user từ LocalStorage
    const storedUser = localStorage.getItem('currentUser');
    const user = storedUser ? JSON.parse(storedUser) : null;

    // 2. Kiểm tra logic
    
    // Trường hợp A: Chưa đăng nhập -> Đá về trang Login
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Trường hợp B: Đã đăng nhập nhưng Role không phải admin -> Đá về Home
    if (user.role !== 'admin') {
        return <Navigate to="/home" replace />;
    }

    // Trường hợp C: Hợp lệ -> Cho phép hiển thị các Route con bên trong
    return <Outlet />;
};

export default AdminRoute;