<?php

namespace App\Http\Controllers;

use App\Models\DonHang;
use App\Models\ChiTietDonHang;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DonHangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = DonHang::with(['nguoiDung', 'chiTietDonHangs.sanPham', 'thanhToan']);

        // Lọc theo người dùng
        if ($request->has('ma_nguoi_dung')) {
            $query->where('ma_nguoi_dung', $request->ma_nguoi_dung);
        }

        // Lọc theo trạng thái
        if ($request->has('trang_thai')) {
            $query->where('trang_thai', $request->trang_thai);
        }

        $donHangs = $query->orderBy('ngay_dat', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $donHangs
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ma_nguoi_dung' => 'required|exists:nguoi_dung,ma_nguoi_dung',
            'dia_chi_giao_hang' => 'required|string',
            'ghi_chu' => 'nullable|string',
            'chi_tiet' => 'required|array|min:1',
            'chi_tiet.*.ma_san_pham' => 'required|exists:san_pham,ma_san_pham',
            'chi_tiet.*.so_luong' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            // Tính tổng tiền
            $tongTien = 0;
            foreach ($validated['chi_tiet'] as $item) {
                $sanPham = \App\Models\SanPham::find($item['ma_san_pham']);
                $tongTien += $sanPham->gia_ban * $item['so_luong'];
            }

            // Tạo đơn hàng
            $donHang = DonHang::create([
                'ma_nguoi_dung' => $validated['ma_nguoi_dung'],
                'ngay_dat' => now(),
                'tong_tien' => $tongTien,
                'trang_thai' => 'pending',
                'dia_chi_giao_hang' => $validated['dia_chi_giao_hang'],
                'ghi_chu' => $validated['ghi_chu'] ?? null,
            ]);

            // Tạo chi tiết đơn hàng
            foreach ($validated['chi_tiet'] as $item) {
                $sanPham = \App\Models\SanPham::find($item['ma_san_pham']);
                
                ChiTietDonHang::create([
                    'ma_don_hang' => $donHang->ma_don_hang,
                    'ma_san_pham' => $item['ma_san_pham'],
                    'so_luong' => $item['so_luong'],
                    'gia_mua' => $sanPham->gia_ban,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Tạo đơn hàng thành công',
                'data' => $donHang->load(['chiTietDonHangs.sanPham', 'nguoiDung'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Tạo đơn hàng thất bại: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $donHang = DonHang::with(['nguoiDung', 'chiTietDonHangs.sanPham', 'thanhToan'])->find($id);

        if (!$donHang) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $donHang
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $donHang = DonHang::find($id);

        if (!$donHang) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng'
            ], 404);
        }

        $validated = $request->validate([
            'trang_thai' => 'sometimes|required|in:pending,processing,completed,cancelled',
            'dia_chi_giao_hang' => 'sometimes|required|string',
            'ghi_chu' => 'nullable|string',
        ]);

        $donHang->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật đơn hàng thành công',
            'data' => $donHang->load(['nguoiDung', 'chiTietDonHangs.sanPham', 'thanhToan'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $donHang = DonHang::find($id);

        if (!$donHang) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng'
            ], 404);
        }

        $donHang->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa đơn hàng thành công'
        ]);
    }
}
