import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductList({ categoryId = false, search = false }) {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8; // Số sản phẩm mỗi trang
  const navigate = useNavigate();
  console.log(categoryId);

  // 1. CẤU HÌNH API
  const API_URL = 'https://backendfish.mnhwua.id.vn/api/san-pham';
  const handleProductDetail = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error('Lỗi kết nối server');
        }

        const responseData = await res.json();
        console.log('Data fetched:', responseData);

        // Xử lý dữ liệu trả về dựa trên cấu trúc JSON bạn cung cấp:
        // { "success": true, "data": [...] }
        let realData = [];
        if (responseData.data && Array.isArray(responseData.data)) {
          realData = responseData.data;
        } else if (Array.isArray(responseData)) {
          realData = responseData;
        }

        // Lọc theo danh mục nếu có

        if (categoryId) {
          realData = realData.filter(
            (product) => product.ma_danh_muc === categoryId
          );
        }
        if (search) {
          realData = realData.filter((product) => {
            const searchLower = search.toLowerCase();
            const name = product.ten_san_pham?.toLowerCase() || '';

            // Tìm trong tên hoặc mô tả
            return name.includes(searchLower);
          });
        }

        setProductList(realData);
        setCurrentPage(1); // Reset về trang 1 khi dữ liệu thay đổi
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
        setProductList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  // Reset trang khi search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // 2. HÀM XỬ LÝ URL HÌNH ẢNH
  const getImageUrl = (urlFromDb) => {
    if (!urlFromDb) return 'https://placehold.co/400x300?text=No+Image';

    // Nếu là link online (như trong mẫu JSON bạn gửi) thì giữ nguyên
    if (urlFromDb.startsWith('http')) return urlFromDb;

    // Xử lý trường hợp ảnh lưu đường dẫn tương đối (Local)
    // Giả sử server ảnh là http://127.0.0.1:8000
    const baseUrl = 'http://127.0.0.1:8000';
    const cleanPath = urlFromDb.startsWith('/') ? urlFromDb : `/${urlFromDb}`;
    return `${baseUrl}${cleanPath}`;
  };

  // 3. TÍNH TOÁN PHÂN TRANG
  const totalPages = Math.ceil(productList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = productList.slice(startIndex, endIndex);

  // Tạo mảng số trang để hiển thị
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Số trang tối đa hiển thị
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="w-full mx-auto">
      {loading ? (
        // Loading State
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-blue-500">
          <div className="size-8 sm:size-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-sm sm:text-base">Đang tải danh sách hải sản...</p>
        </div>
      ) : (
        <>
          {/* Grid Layout Wrapper */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => {
                // Map các trường dữ liệu từ API của bạn
                const id = product.ma_san_pham;
                const name = product.ten_san_pham;
                const description = product.mo_ta;
                const price = product.gia_ban;
                const image = getImageUrl(product.hinh_anh);

                return (
                  <div
                    key={id}
                    onClick={() => handleProductDetail(id)}
                    className="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl shadow-sm ring-1 ring-slate-200 hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer h-full"
                  >
                    {/* Image Container */}
                    <div className="aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                      <div
                        className="w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url("${image}")` }}
                      ></div>
                      {/* Overlay hover hiệu ứng */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-blue-900/10 transition-colors duration-300"></div>

                      {/* Badge Tồn kho (Optional) */}
                      {product.so_luong_ton > 0 && (
                        <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-green-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm">
                          Còn hàng
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-2.5 sm:p-4 flex flex-col flex-grow">
                      <div className="flex flex-col flex-grow">
                        {/* Danh mục (nhỏ) */}
                        {product.danh_muc && (
                          <p className="text-[10px] sm:text-xs text-blue-500 font-bold mb-1 uppercase tracking-wider line-clamp-1">
                            {product.danh_muc.ten_danh_muc}
                          </p>
                        )}

                        <h3 className="font-display text-sm sm:text-base md:text-lg font-bold text-blue-900 leading-tight mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 h-[2.5rem] sm:h-[3rem]">
                          {name}
                        </h3>

                        {/* Mô tả với tiêu đề */}
                        <div className="hidden sm:block mb-2 sm:mb-3 h-[3.5rem]">
                          <p className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">
                            Mô tả:
                          </p>
                          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                            {description || 'Mô tả đang cập nhật...'}
                          </p>
                        </div>

                        {/* Giá - đẩy xuống dưới cùng */}
                        <p className="font-bold text-blue-600 text-base sm:text-lg md:text-xl mt-auto pt-2">
                          {price ? (
                            <>
                              {Number(price).toLocaleString('vi-VN')}đ{' '}
                              <span className="text-xs sm:text-sm font-normal text-slate-400">
                                / kg
                              </span>
                            </>
                          ) : (
                            <span className="text-sm sm:text-base text-blue-500">
                              Liên hệ
                            </span>
                          )}
                        </p>
                      </div>

                      <button className="mt-2.5 sm:mt-4 w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-lg bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-200 hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all duration-300">
                        <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                          add_shopping_cart
                        </span>
                        <span className="hidden xs:inline">Xem chi tiết</span>
                        <span className="xs:hidden">Xem</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-slate-400 py-16">
                <span className="material-symbols-outlined text-4xl mb-2">
                  set_meal
                </span>
                <p>Chưa có sản phẩm nào được tìm thấy.</p>
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-slate-100">
              {/* Nút Previous */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  currentPage === 1
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 shadow-sm ring-1 ring-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                <span className="hidden sm:inline">Trước</span>
              </button>

              {/* Số trang */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={page === '...'}
                    className={`min-w-[36px] h-9 px-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      page === currentPage
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : page === '...'
                        ? 'text-slate-400 cursor-default'
                        : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 shadow-sm ring-1 ring-slate-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Nút Next */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  currentPage === totalPages
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 shadow-sm ring-1 ring-slate-200'
                }`}
              >
                <span className="hidden sm:inline">Sau</span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          )}

          {/* Thông tin phân trang */}
          {productList.length > 0 && (
            <p className="text-center text-sm text-slate-400 mt-4">
              Hiển thị {startIndex + 1} - {Math.min(endIndex, productList.length)} trong tổng số {productList.length} sản phẩm
            </p>
          )}
        </>
      )}
    </div>
  );
}

