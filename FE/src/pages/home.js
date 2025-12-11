import Header from '../components/header';
import Footer from '../components/footer';
import ProductList from '../components/product-list';
import CategoryMenu from '../components/category-menu';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. KHAI BÁO ẢNH NỀN (Bạn có thể thay link này bằng link ảnh hải sản khác)
const bgImage = 'https://news.clemson.edu/wp-content/uploads/2023/06/ocean.jpg';

export default function Home() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // --- LOGIC BẢO VỆ TRANG ---
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      navigate('/');
    }
  }, [navigate]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  console.log(selectedCategory);

  if (!localStorage.getItem('user_id')) return null;

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-grow flex flex-col">
        {/* --- SỬA Ở ĐÂY --- */}
        <div
          // 1. Thêm "-mt-24": Kéo ảnh lên trên 96px để lấp khoảng trắng của Header
          // 2. "relative z-0": Để ảnh nằm dưới Header (Header thường là z-50)
          className="relative w-full bg-cover bg-center bg-no-repeat shadow-md -mt-24 z-0"
          style={{
            backgroundImage: `url(${bgImage})`,
            height: '700px', // Tăng chiều cao lên chút để bù cho phần bị kéo lên
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>

          {/* Nội dung bên trong */}
          {/* Thêm pt-40: Đẩy nội dung xuống sâu hơn vì khung ảnh đã bị kéo lên trên */}
          <div className="relative h-full flex flex-col justify-end pb-20 pt-40 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* ... Phần nội dung bên trong giữ nguyên ... */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              {/* Title & Description */}
              <div className="max-w-2xl">
                <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/80 text-white text-xs font-bold mb-4 backdrop-blur-sm border border-cyan-200/50 shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                  HẢI SẢN TƯƠI SỐNG
                </span>

                {/* TIÊU ĐỀ CHÍNH */}
                <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-tight mb-4 bg-gradient-to-br from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_4px_3px_rgba(0,0,0,0.4)]">
                  Vị Ngon <br />
                  <span className="text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                    Từ Biển Cả
                  </span>
                </h1>

                {/* DÒNG MÔ TẢ */}
                <p className="text-cyan-50 text-lg font-medium leading-relaxed drop-shadow-md border-l-4 border-cyan-400 pl-4 bg-black/10 backdrop-blur-sm py-2 rounded-r-lg">
                  Cam kết nguồn gốc rõ ràng, đánh bắt trong ngày và giao hàng
                  siêu tốc.
                </p>
              </div>

              {/* Search Bar */}
            </div>
          </div>
        </div>

        {/* 2. PRODUCT LIST */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 -mt-16 pb-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Category Menu - Left Sidebar */}
              <div className="md:col-span-1">
                <CategoryMenu onSelectCategory={handleCategorySelect} />
              </div>

              {/* Product List - Right Content */}
              <div className="md:col-span-3">
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 md:p-12">
                  <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <span className="material-symbols-outlined text-3xl">
                          water_drop
                        </span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                          {selectedCategory
                            ? selectedCategory.ten_danh_muc
                            : 'Sản phẩm nổi bật'}
                        </h2>
                        <p className="text-slate-500 text-sm">
                          Lựa chọn tốt nhất cho bữa ăn của bạn
                        </p>
                      </div>
                    </div>
                  </div>

                  <ProductList categoryId={selectedCategory?.ma_danh_muc} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
