import Footer from '../components/footer';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/header';
import ProductList from '../components/product-list';

export default function ProductSearch() {
  const [loading, setLoading] = useState(true);

  // Lấy ID từ URL (ví dụ: /product/2)
  const { product_id } = useParams();

  // CẤU HÌNH SERVER
  const APP_BASE_URL = 'https://backendfish.mnhwua.id.vn/api/san-pham';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // --- THAY ĐỔI 1: Gọi đúng API cho bảng San_pham ---
        // Lưu ý: Kiểm tra lại trong Spring Boot Controller xem bạn map là /Sanpham hay /products
        const res = await fetch(APP_BASE_URL);

        if (!res.ok) {
          throw new Error('Lỗi kết nối server');
        }

        const data = await res.json();
        console.log('Dữ liệu sản phẩm:', data);
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    if (product_id) {
      fetchData();
    }
  }, [product_id]);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 font-body text-slate-600 min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <a href="/home" className="hover:text-blue-600 transition-colors">
              Trang chủ
            </a>
            <span>/</span>
            <span className=" text-blue-900 truncate max-w-[200px]">
              {/* --- THAY ĐỔI 3: Map cột 'ten_san_pham' --- */}Tìm kiếm&nbsp;"
              {product_id}&nbsp;"
            </span>
          </nav>
          <ProductList search={product_id} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
