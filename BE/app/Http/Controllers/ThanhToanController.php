<?php

namespace App\Http\Controllers;

use App\Models\ThanhToan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ThanhToanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = ThanhToan::with('donHang');

        // Lọc theo trạng thái
        if ($request->has('trang_thai')) {
            $query->where('trang_thai', $request->trang_thai);
        }

        // Lọc theo phương thức
        if ($request->has('phuong_thuc')) {
            $query->where('phuong_thuc', $request->phuong_thuc);
        }

        $thanhToans = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $thanhToans
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ma_don_hang' => 'required|exists:don_hang,ma_don_hang',
            'phuong_thuc' => 'required|in:cash,credit_card,bank_transfer,e_wallet',
            'so_tien' => 'required|numeric|min:0',
            'noi_dung' => 'nullable|string',
        ]);

        $validated['trang_thai'] = 'pending';

        $thanhToan = ThanhToan::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tạo thanh toán thành công',
            'data' => $thanhToan->load('donHang')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $thanhToan = ThanhToan::with('donHang.nguoiDung')->find($id);

        if (!$thanhToan) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy thanh toán'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $thanhToan
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $thanhToan = ThanhToan::find($id);

        if (!$thanhToan) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy thanh toán'
            ], 404);
        }

        $validated = $request->validate([
            'trang_thai' => 'sometimes|required|in:pending,completed,failed,refunded',
            'ma_giao_dich' => 'nullable|string|max:100',
            'ma_loi' => 'nullable|string|max:50',
            'thong_bao_loi' => 'nullable|string|max:255',
        ]);

        // Nếu trạng thái chuyển sang completed, cập nhật ngày thanh toán
        if (isset($validated['trang_thai']) && $validated['trang_thai'] === 'completed') {
            $validated['ngai_thanh_toan'] = now();
        }

        $thanhToan->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thanh toán thành công',
            'data' => $thanhToan->load('donHang')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $thanhToan = ThanhToan::find($id);

        if (!$thanhToan) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy thanh toán'
            ], 404);
        }

        $thanhToan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa thanh toán thành công'
        ]);
    }
}
