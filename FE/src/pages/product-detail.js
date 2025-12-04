import Header from "../components/header";
import Footer from "../components/footer";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const navigate = useNavigate();

    // Lấy ID từ URL (ví dụ: /product/2)
    const { product_id } = useParams();

    // CẤU HÌNH SERVER
    const APP_BASE_URL = "http://127.0.0.1:8000/api";

    // --- CODE MỚI: Xử lý thêm vào giỏ hàng ---
    const handleAddToCart = () => {
        if (!productData) return;

        // 1. Lấy giỏ hàng cũ từ LocalStorage (nếu chưa có thì tạo mảng rỗng)
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // 2. Kiểm tra xem sản phẩm này đã có trong giỏ chưa
        const existingItemIndex = cart.findIndex(item => item.id === productData.ma_san_pham);

        if (existingItemIndex > -1) {
            // Nếu có rồi -> Cộng dồn số lượng
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Nếu chưa có -> Thêm mới và map đúng trường dữ liệu cho trang Cart đọc
            const newItem = {
                id: productData.ma_san_pham,      // Map 'ma_san_pham' -> 'id'
                name: productData.ten_san_pham,   // Map 'ten_san_pham' -> 'name'
                price: Number(productData.gia_ban),
                image: imageUrl,                  // Dùng link ảnh đã xử lý
                desc: productData.mo_ta || "Sản phẩm từ vựa cá",
                quantity: quantity
            };
            cart.push(newItem);
        }

        // 3. Lưu ngược lại vào LocalStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // 4. Thông báo cho người dùng
        alert("Đã thêm sản phẩm vào giỏ hàng thành công!");
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // --- THAY ĐỔI 1: Gọi đúng API cho bảng San_pham ---
                // Lưu ý: Kiểm tra lại trong Spring Boot Controller xem bạn map là /Sanpham hay /products
                const res = await fetch(`${APP_BASE_URL}/san-pham/${product_id}`);

                if (!res.ok) {
                    throw new Error("Lỗi kết nối server");
                }

                const data = await res.json();
                console.log("Dữ liệu sản phẩm:", data);
                setProduct(data);
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (product_id) {
            fetchData();
        }
    }, [product_id]);

    // Xử lý link ảnh
    const getImageUrl = (urlFromDb) => {
        if (!urlFromDb) return 'https://placehold.co/400x300?text=No+Image';
        
        // Trường hợp trong hình của bạn là link online (https://cdn.tgdd.vn...)
        if (urlFromDb.startsWith('http')) return urlFromDb;

        // Trường hợp ảnh lưu local trong project
        let relativePath = urlFromDb;
        if (!relativePath.includes('images/loaica')) {
            const cleanFileName = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
            // Bạn có thể cần đổi 'loaica' thành folder khác tùy nơi bạn lưu ảnh sản phẩm
            relativePath = `/images/sanpham/${cleanFileName}`; 
        } else {
             relativePath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
        }
        
        return `${APP_BASE_URL}${relativePath}`;
    };

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

    // Xử lý data trả về (đôi khi Spring Boot trả về trực tiếp object, đôi khi bọc trong .result)
    const productData = product?.result || product?.data || product;

    if (!productData) {
        return (
            <div className="bg-slate-50 min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex flex-col items-center justify-center text-slate-600">
                    <h2 className="text-2xl font-bold mb-2 text-blue-900">Không tìm thấy sản phẩm</h2>
                    <a href="/home" className="mt-4 text-blue-600 hover:underline font-medium">Quay lại trang chủ</a>
                </div>
                <Footer />
            </div>
        );
    }

    // --- THAY ĐỔI 2: Map đúng cột 'hinh_anh' trong DB ---
    const imageUrl = getImageUrl(productData.hinh_anh);

    return (
        <div className="bg-slate-50 font-body text-slate-600 min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">

                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
                        <a href="/home" className="hover:text-blue-600 transition-colors">Trang chủ</a>
                        <span>/</span>
                        <span className="font-medium text-blue-900 truncate max-w-[200px]">
                            {/* --- THAY ĐỔI 3: Map cột 'ten_san_pham' --- */}
                            {productData.ten_san_pham}
                        </span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                        {/* ẢNH SẢN PHẨM */}
                        <div className="flex flex-col gap-4">
                            <div className="group relative w-full aspect-square overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                                <div
                                    className="w-full h-full bg-center bg-contain bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url("${imageUrl}")` }}>
                                </div>
                            </div>
                        </div>

                        {/* THÔNG TIN SẢN PHẨM */}
                        <div className="flex flex-col h-full">
                            <div className="mb-6">
                                <h1 className="font-display text-3xl md:text-4xl font-bold text-blue-900 leading-tight mb-2">
                                    {/* --- THAY ĐỔI 3: Map cột 'ten_san_pham' --- */}
                                    {productData.ten_san_pham}
                                </h1>
                                <p className="text-sm font-medium text-slate-400">
                                    Mã SP: <span className="text-slate-600">{productData.ma_san_pham}</span>
                                </p>
                                {/* Hiển thị thêm số lượng tồn kho nếu cần */}
                                <p className="text-sm font-medium text-slate-400 mt-1">
                                    Tồn kho: <span className="text-slate-600">{productData.so_luong_ton}</span>
                                </p>
                            </div>

                            <div className="mb-8">
                                <p className="text-4xl font-bold text-blue-600 flex items-end gap-2">
                                    {/* --- THAY ĐỔI 4: Map cột 'gia_ban' --- */}
                                    {Number(productData.gia_ban).toLocaleString('vi-VN')}đ
                                    <span className="text-lg font-normal text-slate-400 mb-1">/ kg</span>
                                </p>
                            </div>

                            <p className="text-slate-500 leading-relaxed mb-8 text-lg">
                                {/* --- THAY ĐỔI 5: Map cột 'mo_ta' --- */}
                                {productData.mo_ta || "Sản phẩm tươi ngon từ Vựa cá Minh Quân."}
                            </p>

                            {/* Bộ chọn số lượng */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                                <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="size-10 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">remove</span>
                                    </button>
                                    <input
                                        type="text"
                                        value={quantity}
                                        readOnly
                                        className="w-12 text-center bg-transparent border-none text-blue-900 font-bold focus:ring-0"
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="size-10 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">add</span>
                                    </button>
                                </div>

                                <button 
                                onClick={handleAddToCart}
                                className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all duration-300">
                                    <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                                    Thêm vào giỏ
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* TAB MÔ TẢ CHI TIẾT */}
                    <div className="mt-16 lg:mt-24">
                        <div className="border-b border-slate-200 mb-8">
                            <div className="flex gap-8 overflow-x-auto pb-px">
                                <button className="pb-4 text-base font-bold text-blue-900 border-b-2 border-blue-600">
                                    Chi tiết sản phẩm
                                </button>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm ring-1 ring-slate-100">
                            <ul className="list-none space-y-4 text-slate-600">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-blue-500 mt-0.5">info</span>
                                    <span>
                                        <strong>Mô tả: </strong>
                                        {/* --- Map lại cột 'mo_ta' --- */}
                                        {productData.mo_ta}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-blue-500 mt-0.5">check_circle</span>
                                    <span><strong>Tình trạng: </strong> {productData.so_luong_ton > 0 ? "Còn hàng" : "Hết hàng"}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}