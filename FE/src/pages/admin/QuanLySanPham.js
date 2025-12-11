import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function QuanLySanPham() {
  // 1. State lưu trữ dữ liệu
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // State lưu danh mục để select
  const [loading, setLoading] = useState(true);

  // Cấu hình URL API (Chỉnh lại port 8000 theo API bạn cung cấp)
  const APP_BASE_URL = 'https://backendfish.mnhwua.id.vn/api';

  // 2. Fetch Data (Sản phẩm & Danh mục) khi trang tải
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Gọi song song 2 API để tiết kiệm thời gian
        const [resProducts, resCategories] = await Promise.all([
          fetch(`${APP_BASE_URL}/san-pham`),
          fetch(`${APP_BASE_URL}/danh-muc`),
        ]);

        if (!resProducts.ok || !resCategories.ok) {
          throw new Error('Lỗi kết nối server');
        }

        const dataProd = await resProducts.json();
        const dataCat = await resCategories.json();

        // Set State Sản phẩm
        if (dataProd.success) {
          setProducts(dataProd.data);
        }

        // Set State Danh mục
        if (dataCat.success) {
          setCategories(dataCat.data);
        }
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
        alert('Không thể tải dữ liệu từ server.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- LOGIC CHO MODAL (THÊM / SỬA) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // State form cho sản phẩm
  const initialProductState = {
    ma_san_pham: null,
    ma_danh_muc: '', // Để chọn trong select
    ten_san_pham: '',
    mo_ta: '',
    gia_ban: 0,
    so_luong_ton: 0,
    hinh_anh: '',
    hien_thi: true,
  };

  const [currentProduct, setCurrentProduct] = useState(initialProductState);

  const handleMoTabThemMoi = () => {
    setIsEditing(false);
    // Nếu có danh mục, mặc định chọn cái đầu tiên
    setCurrentProduct({
      ...initialProductState,
      ma_danh_muc: categories.length > 0 ? categories[0].ma_danh_muc : '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProduct({
      ma_san_pham: product.ma_san_pham,
      ma_danh_muc: product.ma_danh_muc,
      ten_san_pham: product.ten_san_pham,
      mo_ta: product.mo_ta || '',
      gia_ban: parseFloat(product.gia_ban),
      so_luong_ton: product.so_luong_ton,
      hinh_anh: product.hinh_anh,
      hien_thi: product.hien_thi == 1 || product.hien_thi === true, // Handle backend trả về 1/0 hoặc true/false
    });
    setIsModalOpen(true);
  };

  // --- XỬ LÝ LƯU (THÊM / SỬA) ---
  const handleSave = async (e) => {
    e.preventDefault();

    // Validate cơ bản
    if (!currentProduct.ma_danh_muc) {
      alert('Vui lòng chọn danh mục!');
      return;
    }

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `${APP_BASE_URL}/san-pham/${currentProduct.ma_san_pham}`
        : `${APP_BASE_URL}/san-pham`;

      // Chuẩn bị payload (theo format API bạn cung cấp)
      const payload = {
        ma_danh_muc: parseInt(currentProduct.ma_danh_muc),
        ten_san_pham: currentProduct.ten_san_pham,
        mo_ta: currentProduct.mo_ta,
        gia_ban: parseFloat(currentProduct.gia_ban),
        hinh_anh: currentProduct.hinh_anh,
        so_luong_ton: parseInt(currentProduct.so_luong_ton),
        hien_thi: currentProduct.hien_thi,
      };

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Lỗi khi lưu sản phẩm');
      }

      // Reload lại danh sách sau khi lưu thành công
      // Cách tối ưu hơn là update state trực tiếp, nhưng reload lại cho chắc chắn đồng bộ
      alert(isEditing ? 'Cập nhật thành công!' : 'Thêm mới thành công!');

      // Refetch data
      const resNew = await fetch(`${APP_BASE_URL}/san-pham`);
      const dataNew = await resNew.json();
      if (dataNew.success) setProducts(dataNew.data);

      setIsModalOpen(false);
    } catch (error) {
      console.error('Lỗi lưu:', error);
      alert('Có lỗi xảy ra: ' + error.message);
    }
  };

  // --- XỬ LÝ XÓA ---
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        const res = await fetch(`${APP_BASE_URL}/san-pham/${id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          throw new Error('Không thể xóa sản phẩm');
        }

        // Cập nhật giao diện
        setProducts(products.filter((item) => item.ma_san_pham !== id));
        alert('Đã xóa thành công!');
      } catch (error) {
        console.error('Lỗi xóa:', error);
        alert('Lỗi khi xóa: ' + error.message);
      }
    }
  };

  // Helper: Tìm tên danh mục từ ID (để hiển thị trên bảng)
  const getCategoryName = (catId) => {
    const cat = categories.find((c) => c.ma_danh_muc === catId);
    return cat ? cat.ten_danh_muc : '---';
  };

  return (
    <AdminLayout title="Quản Lý Sản Phẩm">
      {/* --- TOOLBAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        <button
          onClick={handleMoTabThemMoi}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>
          Thêm Sản Phẩm
        </button>
      </div>

      {/* --- MAIN TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                <th className="p-4 w-16 text-center">ID</th>
                <th className="p-4 w-24">Hình ảnh</th>
                <th className="p-4">Tên Sản Phẩm</th>
                <th className="p-4">Danh Mục</th>
                <th className="p-4 text-right">Giá Bán</th>
                <th className="p-4 text-center">Tồn Kho</th>
                <th className="p-4 text-center">Hiển thị</th>
                <th className="p-4 text-center w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="size-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((item) => (
                  <tr
                    key={item.ma_san_pham}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4 text-center font-medium text-slate-500">
                      #{item.ma_san_pham}
                    </td>
                    <td className="p-4">
                      <div className="size-12 rounded-lg border border-slate-200 overflow-hidden bg-slate-100">
                        <img
                          src={item.hinh_anh}
                          alt={item.ten_san_pham}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              'https://placehold.co/100x100?text=No+Img';
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-blue-900">
                      {item.ten_san_pham}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {/* Ưu tiên lấy từ object danh_muc nếu có, nếu không thì tìm trong list categories */}
                        {item.danh_muc
                          ? item.danh_muc.ten_danh_muc
                          : getCategoryName(item.ma_danh_muc)}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium">
                      {parseFloat(item.gia_ban).toLocaleString('vi-VN')}đ
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`font-bold ${
                          item.so_luong_ton < 10
                            ? 'text-red-500'
                            : 'text-slate-700'
                        }`}
                      >
                        {item.so_luong_ton}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {item.hien_thi ? (
                        <span className="material-symbols-outlined text-green-500 text-xl">
                          check_circle
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-slate-300 text-xl">
                          cancel
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="size-8 flex items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Sửa"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            edit_square
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.ma_san_pham)}
                          className="size-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Xóa"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500">
                    Không có sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">
                {isEditing ? 'Cập nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <form
                id="productForm"
                onSubmit={handleSave}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tên SP */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={currentProduct.ten_san_pham}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          ten_san_pham: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                      placeholder="Ví dụ: Tôm hùm Alaska"
                    />
                  </div>

                  {/* Danh mục (Select box lấy từ API) */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={currentProduct.ma_danh_muc}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          ma_danh_muc: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((cat) => (
                        <option key={cat.ma_danh_muc} value={cat.ma_danh_muc}>
                          {cat.ten_danh_muc}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Giá bán */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Giá bán (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={currentProduct.gia_ban}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          gia_ban: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Số lượng tồn */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Số lượng tồn kho
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={currentProduct.so_luong_ton}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          so_luong_ton: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* URL Hình ảnh */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      URL Hình ảnh
                    </label>
                    <input
                      type="text"
                      value={currentProduct.hinh_anh}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          hinh_anh: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                      placeholder="https://..."
                    />
                  </div>

                  {/* Checkbox Hiển thị */}
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentProduct.hien_thi}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            hien_thi: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-bold text-slate-700">
                        Đang kinh doanh (Hiển thị)
                      </span>
                    </label>
                  </div>

                  {/* Mô tả */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Mô tả sản phẩm
                    </label>
                    <textarea
                      rows="4"
                      value={currentProduct.mo_ta}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          mo_ta: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none"
                      placeholder="Nhập thông tin chi tiết..."
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                form="productForm"
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
              >
                {isEditing ? 'Lưu thay đổi' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
