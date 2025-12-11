import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductList({ categoryId = false, search = false }) {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
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
            const description = product.mo_ta?.toLowerCase() || '';

            // Tìm trong tên hoặc mô tả
            return (
              name.includes(searchLower) || description.includes(searchLower)
            );
          });
        }

        setProductList(realData);
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
        setProductList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {loading ? (
        // Loading State
        <div className="flex flex-col items-center justify-center py-20 text-blue-500">
          <div className="size-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p>Đang tải danh sách hải sản...</p>
        </div>
      ) : (
        // Grid Layout Wrapper
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productList.length > 0 ? (
            productList.map((product) => {
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
                  className="group relative flex flex-col bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer h-full"
                >
                  {/* Image Container */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                    <div
                      className="w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url("${image}")` }}
                    ></div>
                    {/* Overlay hover hiệu ứng */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-blue-900/10 transition-colors duration-300"></div>

                    {/* Badge Tồn kho (Optional) */}
                    {product.so_luong_ton > 0 && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        Còn hàng
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex-grow">
                      {/* Danh mục (nhỏ) */}
                      {product.danh_muc && (
                        <p className="text-xs text-blue-500 font-bold mb-1 uppercase tracking-wider">
                          {product.danh_muc.ten_danh_muc}
                        </p>
                      )}

                      <h3 className="font-display text-lg font-bold text-blue-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3rem]">
                        {name}
                      </h3>

                      <p className="text-sm text-slate-500 line-clamp-2 mb-3 min-h-[2.5rem]">
                        {description || 'Mô tả đang cập nhật...'}
                      </p>

                      <p className="font-bold text-blue-600 text-xl mt-auto">
                        {price ? (
                          <>
                            {Number(price).toLocaleString('vi-VN')}đ{' '}
                            <span className="text-sm font-normal text-slate-400">
                              / kg
                            </span>
                          </>
                        ) : (
                          <span className="text-base text-blue-500">
                            Liên hệ
                          </span>
                        )}
                      </p>
                    </div>

                    <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all duration-300">
                      <span className="material-symbols-outlined text-[18px]">
                        add_shopping_cart
                      </span>
                      Xem chi tiết
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
      )}
    </div>
  );
}
