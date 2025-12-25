import Header from '../components/header';
import Footer from '../components/footer';
import ProductList from '../components/product-list';
import CategoryMenu from '../components/category-menu';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. KHAI BÁO ẢNH NỀN (Bạn có thể thay link này bằng link ảnh hải sản khác)
const bgImage = 'https://news.clemson.edu/wp-content/uploads/2023/06/ocean.jpg';
const bgVideo = 'https://rr3---sn-npoeens7.googlevideo.com/videoplayback?expire=1766654234&ei=uqxMabfpCbHB9fwP8pGggQ0&ip=116.109.181.68&id=o-AFAvK8ERQYU4pOz5u5X1ri8q5rcEUXd9hTSzbAG3ndRW&itag=315&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&cps=0&bui=AYUSA3DSGcMjvmjAzH2vR8VW30lI7S6NZsn0or--au-Hos5LJLSw_1j0V7u9eZtlR_kpKN_8YhLeKfJV&spc=wH4Qq0Dtli8d&vprv=1&svpuc=1&mime=video%2Fwebm&rqh=1&gir=yes&clen=101261641287&dur=42898.516&lmt=1714787782426712&keepalive=yes&fexp=51552689,51565116,51565681,51580968&c=ANDROID&txp=730F224&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRgIhAP8NagZSju-X5fr20I__pUPdRPMCI0MxC8H1ZHLXa33YAiEAkPwxoVLIxI1aAJqEgMHzChUf5VAJoVpWABdV0Ht_MVI%3D&rm=sn-8pxuuxa-nbozz7r,sn-8pxuuxa-nbo6l7r,sn-npods7l&rrc=79,79,104&req_id=31aa86117491a3ee&rms=nxu,au&redirect_counter=3&cms_redirect=yes&cmsv=e&ipbypass=yes&met=1766632645,&mh=pX&mip=183.80.16.160&mm=30&mn=sn-npoeens7&ms=nxu&mt=1766632113&mv=m&mvi=3&pl=24&lsparams=cps,ipbypass,met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=APaTxxMwRAIgNLoDLa9J3Cytj17ya00_YirUbLUDCtjWJgtDQ6QWFpgCIBMbSVGACALBN5C6tUl2q-uoKx6CNaKCGhJCiWdHXcvY'; 
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
        {/* HERO SECTION */}
        <div
          className="relative w-full overflow-hidden shadow-md -mt-20 sm:-mt-24 z-0"
          style={{
            height: 'auto',
            minHeight: '600px',
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src={bgVideo} type="video/mp4" />
            {/* Fallback cho trình duyệt không hỗ trợ video */}
            Your browser does not support the video tag.
          </video>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>

          {/* Nội dung bên trong */}
          <div className="relative h-full flex flex-col justify-end pb-12 sm:pb-20 pt-32 sm:pt-40 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
              {/* Title & Description */}
              <div className="max-w-2xl">
                <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/80 text-white text-xs font-bold mb-3 sm:mb-4 backdrop-blur-sm border border-cyan-200/50 shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                  HẢI SẢN TƯƠI SỐNG
                </span>

                {/* TIÊU ĐỀ CHÍNH */}
                <h1 className="font-display text-3xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-3 sm:mb-4 bg-gradient-to-br from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_4px_3px_rgba(0,0,0,0.4)]">
                  Vị Ngon <br />
                  <span className="text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                    Từ Biển Cả
                  </span>
                </h1>

                {/* DÒNG MÔ TẢ */}
                <p className="text-cyan-50 text-sm sm:text-lg font-medium leading-relaxed drop-shadow-md border-l-4 border-cyan-400 pl-3 sm:pl-4 bg-black/10 backdrop-blur-sm py-2 rounded-r-lg">
                  Cam kết nguồn gốc rõ ràng, đánh bắt trong ngày và giao hàng
                  siêu tốc.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT LIST */}
        <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 -mt-8 sm:-mt-16 pb-8 sm:pb-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Category Menu - Left Sidebar */}
              <div className="md:col-span-1">
                <CategoryMenu onSelectCategory={handleCategorySelect} />
              </div>

              {/* Product List - Right Content */}
              <div className="md:col-span-3">
                <div className="bg-white rounded-2xl sm:rounded-[2.5rem] shadow-xl border border-slate-100 p-4 sm:p-6 md:p-8 lg:p-12">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-10 border-b border-slate-100 pb-4 sm:pb-6 gap-3">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-blue-50 text-blue-600 rounded-xl sm:rounded-2xl">
                        <span className="material-symbols-outlined text-2xl sm:text-3xl">
                          water_drop
                        </span>
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
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
