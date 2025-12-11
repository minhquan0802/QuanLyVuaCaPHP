import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function GoogleCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  // Dùng ref để chặn việc gọi API 2 lần
  const isCalled = useRef(false);

  useEffect(() => {
    // Lấy params từ URL
    const searchParams = new URLSearchParams(location.search);
    // Ở đây params có thể là ?code=... (nếu Google trả về code)
    // hoặc ?token=... (nếu Laravel đã xử lý và redirect kèm token)

    // --- TRƯỜNG HỢP 1: NẾU LARAVEL ĐÃ XỬ LÝ VÀ TRẢ VỀ TOKEN ---
    const token = searchParams.get('token');
    const userDataStr = searchParams.get('user_data');

    if (token && userDataStr) {
      try {
        localStorage.setItem('token', token);
        const userObj = JSON.parse(decodeURIComponent(userDataStr));
        localStorage.setItem('user_id', userObj.ma_nguoi_dung);
        localStorage.setItem('currentUser', JSON.stringify(userObj));

        window.dispatchEvent(new Event('storage'));
        navigate('/home');
        return;
      } catch (e) {
        console.error(e);
      }
    }

    // --- TRƯỜNG HỢP 2: NẾU ĐÂY LÀ LÚC REACT TỰ GỌI API LÊN LARAVEL (SERVER-SIDE FLOW) ---
    // (Nếu bạn đang dùng flow: React -> Google -> React -> Laravel)
    // Nhưng theo code Controller bạn gửi, Laravel đang Handle Redirect trực tiếp.

    // ==> NẾU LỖI XẢY RA LÚC BẠN VỪA BẤM LOGIN GOOGLE:
    // Có thể do trình duyệt (hoặc extension) đã tải trước trang đích, làm mất hiệu lực code.
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="text-slate-500 font-medium">
          Đang xử lý đăng nhập...
        </span>
      </div>
    </div>
  );
}
