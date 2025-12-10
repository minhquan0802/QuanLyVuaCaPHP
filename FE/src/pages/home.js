// import Header from "../components/header"
// import Footer from "../components/footer"
// import ProductList from "../components/product-list"
// import { useEffect } from "react"
// import { useNavigate } from "react-router-dom"

// export default function Home() {
//     const navigate = useNavigate();

//     // --- LOGIC BẢO VỆ TRANG ---
//     useEffect(() => {
//         // Kiểm tra xem đã có thông tin đăng nhập trong localStorage chưa
//         const userId = localStorage.getItem('user_id');
        
//         // Nếu không tìm thấy user_id, đá về trang login
//         if (!userId) {
//             navigate('/');
//         }
//     }, [navigate]);

//     // (Tùy chọn) Để tránh nhấp nháy giao diện trang chủ trong tíc tắc trước khi chuyển hướng
//     // ta có thể return null nếu chưa đăng nhập
//     if (!localStorage.getItem('user_id')) {
//         return null; 
//     }

//     return (
//         <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
//             <Header />
            
//             <main className="flex-grow flex flex-col">
//                 {/* 1. SECTION HEADER & TOOLBAR */}
//                 <div className="bg-white border-b border-slate-200 shadow-sm mt-24">
//                     <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
//                         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">

//                             {/* Title & Description */}
//                             <div>
//                                 <h1 className="font-display text-3xl md:text-4xl font-bold text-blue-900 leading-tight">
//                                     Thủy Sản Tươi Sống
//                                 </h1>
//                                 <p className="mt-2 text-slate-500 max-w-2xl text-base">
//                                     Nguồn hàng tươi ngon mỗi ngày, được tuyển chọn kỹ lưỡng từ những vùng nuôi trồng đạt chuẩn.
//                                 </p>
//                             </div>

//                             {/* Search Bar */}
//                             <div className="w-full md:w-96">
//                                 <div className="relative group">
//                                     <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//                                         <span className="material-symbols-outlined text-blue-400 group-focus-within:text-blue-600 transition-colors">search</span>
//                                     </div>
//                                     <input
//                                         type="text"
//                                         className="block w-full pl-11 pr-4 py-3 rounded-xl border-none bg-slate-100 text-blue-900 shadow-inner ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ease-in-out"
//                                         placeholder="Tìm kiếm cá, tôm..."
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* 2. PRODUCT LIST SECTION */}
//                 <div className="py-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//                     <ProductList/>
//                 </div>
//             </main>

//             <Footer />
//         </div>
//     )
// }



import Header from "../components/header"
import Footer from "../components/footer"
import ProductList from "../components/product-list"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

// 1. KHAI BÁO ẢNH NỀN (Bạn có thể thay link này bằng link ảnh hải sản khác)
const bgImage = "https://news.clemson.edu/wp-content/uploads/2023/06/ocean.jpg";

export default function Home() {
    const navigate = useNavigate();

    // --- LOGIC BẢO VỆ TRANG ---
    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            navigate('/');
        }
    }, [navigate]);

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
                        height: '700px' // Tăng chiều cao lên chút để bù cho phần bị kéo lên
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
                                   <span className="text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">Từ Biển Cả</span>
                               </h1>

                               {/* DÒNG MÔ TẢ */}
                               <p className="text-cyan-50 text-lg font-medium leading-relaxed drop-shadow-md border-l-4 border-cyan-400 pl-4 bg-black/10 backdrop-blur-sm py-2 rounded-r-lg">
                                   Cam kết nguồn gốc rõ ràng, đánh bắt trong ngày và giao hàng siêu tốc.
                               </p>
                           </div>

                            {/* Search Bar */}
                            <div className="w-full md:w-[450px]">
                                <div className="bg-white/10 backdrop-blur-md p-2 rounded-3xl border border-white/20 shadow-2xl">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <span className="material-symbols-outlined text-slate-300 group-focus-within:text-blue-400 transition-colors">search</span>
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-12 pr-4 py-4 rounded-2xl border-none bg-white/90 text-slate-900 shadow-sm placeholder:text-slate-500 focus:bg-white focus:ring-0 transition-all"
                                            placeholder="Bạn muốn ăn gì hôm nay?"
                                        />
                                        <button className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/30">
                                            Tìm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. PRODUCT LIST */}
                <div className="relative z-10 px-4 sm:px-6 lg:px-8 -mt-16 pb-12">
                    <div className="mx-auto max-w-7xl bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 md:p-12">
                        <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                    <span className="material-symbols-outlined text-3xl">water_drop</span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Sản phẩm nổi bật</h2>
                                    <p className="text-slate-500 text-sm">Lựa chọn tốt nhất cho bữa ăn của bạn</p>
                                </div>
                            </div>
                        </div>
                        
                        <ProductList/>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}