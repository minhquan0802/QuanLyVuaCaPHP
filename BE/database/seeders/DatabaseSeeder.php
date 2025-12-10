<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Xóa dữ liệu cũ
        DB::table('chi_tiet_don_hang')->delete();
        DB::table('thanh_toan')->delete();
        DB::table('don_hang')->delete();
        DB::table('san_pham')->delete();
        DB::table('danh_muc')->delete();
        DB::table('nguoi_dung')->delete();

        // Seed Danh mục
        $danhMucIds = [];
        $danhMucs = [
            ['ten_danh_muc' => 'Hải sản tươi sống', 'mo_ta' => 'Cá, tôm, mực, cua các loại'],
            ['ten_danh_muc' => 'Hải sản khô', 'mo_ta' => 'Khô cá, tôm khô, mực khô'],
            ['ten_danh_muc' => 'Hải sản đông lạnh', 'mo_ta' => 'Hải sản đã qua chế biến đông lạnh'],
            ['ten_danh_muc' => 'Ốc - Sò - Ngao', 'mo_ta' => 'Các loại ốc biển, sò, nghêu, ngao'],
            ['ten_danh_muc' => 'Hải sản cao cấp', 'mo_ta' => 'Tôm hùm, cua hoàng đế, bào ngư'],
        ];
        
        foreach ($danhMucs as $dm) {
            $danhMucIds[] = DB::table('danh_muc')->insertGetId([
                'ten_danh_muc' => $dm['ten_danh_muc'],
                'mo_ta' => $dm['mo_ta'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed Người dùng
        $nguoiDungIds = [];
        for ($i = 1; $i <= 10; $i++) {
            $nguoiDungIds[] = DB::table('nguoi_dung')->insertGetId([
                'ho_ten' => 'Nguyễn Văn ' . chr(64 + $i),
                'email' => 'user' . $i . '@example.com',
                'mat_khau' => Hash::make('password123'),
                'so_dien_thoai' => '09' . rand(10000000, 99999999),
                'dia_chi' => 'Địa chỉ ' . $i . ', Quận ' . rand(1, 12) . ', TP.HCM',
                'ngay_tao' => Carbon::now()->subDays(rand(1, 365)),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed Sản phẩm
        $sanPhamIds = [];
        $sanPhams = [
            ['ten' => 'Tôm sú tươi', 'danh_muc' => 0, 'gia' => 350000, 'ton' => 50],
            ['ten' => 'Cá hồi Na Uy', 'danh_muc' => 0, 'gia' => 450000, 'ton' => 30],
            ['ten' => 'Mực ống tươi', 'danh_muc' => 0, 'gia' => 180000, 'ton' => 60],
            ['ten' => 'Cua hoàng đế Alaska', 'danh_muc' => 4, 'gia' => 2500000, 'ton' => 15],
            ['ten' => 'Tôm khô loại 1', 'danh_muc' => 1, 'gia' => 420000, 'ton' => 40],
            ['ten' => 'Mực khô cao cấp', 'danh_muc' => 1, 'gia' => 380000, 'ton' => 35],
            ['ten' => 'Cá thu đông lạnh', 'danh_muc' => 2, 'gia' => 150000, 'ton' => 80],
            ['ten' => 'Tôm đông lạnh', 'danh_muc' => 2, 'gia' => 280000, 'ton' => 70],
            ['ten' => 'Nghêu tươi sống', 'danh_muc' => 3, 'gia' => 120000, 'ton' => 100],
            ['ten' => 'Ốc hương tươi', 'danh_muc' => 3, 'gia' => 200000, 'ton' => 45],
            ['ten' => 'Tôm hùm Canada', 'danh_muc' => 4, 'gia' => 1800000, 'ton' => 20],
            ['ten' => 'Bào ngư tươi', 'danh_muc' => 4, 'gia' => 3500000, 'ton' => 10],
        ];

        foreach ($sanPhams as $sp) {
            $sanPhamIds[] = DB::table('san_pham')->insertGetId([
                'ma_danh_muc' => $danhMucIds[$sp['danh_muc']],
                'ten_san_pham' => $sp['ten'],
                'mo_ta' => 'Mô tả chi tiết cho ' . $sp['ten'],
                'gia_ban' => $sp['gia'],
                'hinh_anh' => 'https://via.placeholder.com/500x500?text=' . urlencode($sp['ten']),
                'so_luong_ton' => $sp['ton'],
                'hien_thi' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed Đơn hàng
        $donHangIds = [];
        for ($i = 1; $i <= 20; $i++) {
            $trangThai = ['pending', 'processing', 'completed', 'cancelled'][rand(0, 3)];
            $donHangIds[] = DB::table('don_hang')->insertGetId([
                'ma_nguoi_dung' => $nguoiDungIds[array_rand($nguoiDungIds)],
                'ngay_dat' => Carbon::now()->subDays(rand(1, 60)),
                'tong_tien' => 0, // Sẽ cập nhật sau
                'trang_thai' => $trangThai,
                'dia_chi_giao_hang' => 'Địa chỉ giao hàng ' . $i . ', Quận ' . rand(1, 12) . ', TP.HCM',
                'ghi_chu' => rand(0, 1) ? 'Ghi chú đơn hàng ' . $i : null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed Chi tiết đơn hàng
        foreach ($donHangIds as $donHangId) {
            $soLuongSP = rand(1, 4);
            $tongTien = 0;
            
            for ($i = 0; $i < $soLuongSP; $i++) {
                $sanPhamId = $sanPhamIds[array_rand($sanPhamIds)];
                $sanPham = DB::table('san_pham')->where('ma_san_pham', $sanPhamId)->first();
                $soLuong = rand(1, 3);
                $giaMua = $sanPham->gia_ban;
                
                DB::table('chi_tiet_don_hang')->insert([
                    'ma_don_hang' => $donHangId,
                    'ma_san_pham' => $sanPhamId,
                    'so_luong' => $soLuong,
                    'gia_mua' => $giaMua,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                
                $tongTien += $giaMua * $soLuong;
            }
            
            // Cập nhật tổng tiền đơn hàng
            DB::table('don_hang')->where('ma_don_hang', $donHangId)->update([
                'tong_tien' => $tongTien,
            ]);

            // Seed Thanh toán
            $donHang = DB::table('don_hang')->where('ma_don_hang', $donHangId)->first();
            $phuongThuc = ['cash', 'credit_card', 'bank_transfer', 'e_wallet'][rand(0, 3)];
            $trangThaiTT = $donHang->trang_thai == 'completed' ? 'completed' : 
                          ($donHang->trang_thai == 'cancelled' ? 'failed' : 'pending');
            
            DB::table('thanh_toan')->insert([
                'ma_don_hang' => $donHangId,
                'phuong_thuc' => $phuongThuc,
                'trang_thai' => $trangThaiTT,
                'ngai_thanh_toan' => $trangThaiTT == 'completed' ? Carbon::now()->subDays(rand(1, 60)) : null,
                'so_tien' => $tongTien,
                'noi_dung' => 'Thanh toán đơn hàng #' . $donHangId,
                'ma_giao_dich' => $trangThaiTT == 'completed' ? 'TXN' . strtoupper(uniqid()) : null,
                'ma_loi' => $trangThaiTT == 'failed' ? 'ERR' . rand(100, 999) : null,
                'thong_bao_loi' => $trangThaiTT == 'failed' ? 'Giao dịch thất bại' : null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
