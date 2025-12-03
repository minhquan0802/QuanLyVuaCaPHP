<?php

namespace App\Http\Controllers;

use App\Models\SanPham;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SanPhamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = SanPham::with('danhMuc');

        // Lọc theo danh mục
        if ($request->has('ma_danh_muc')) {
            $query->where('ma_danh_muc', $request->ma_danh_muc);
        }

        // Lọc theo trạng thái hiển thị
        if ($request->has('hien_thi')) {
            $query->where('hien_thi', $request->hien_thi);
        }

        // Tìm kiếm theo tên
        if ($request->has('search')) {
            $query->where('ten_san_pham', 'like', '%' . $request->search . '%');
        }

        $sanPhams = $query->get();

        return response()->json([
            'success' => true,
            'data' => $sanPhams
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ma_danh_muc' => 'required|exists:danh_muc,ma_danh_muc',
            'ten_san_pham' => 'required|string|max:255',
            'mo_ta' => 'nullable|string',
            'gia_ban' => 'required|numeric|min:0',
            'hinh_anh' => 'nullable|string|max:500',
            'so_luong_ton' => 'required|integer|min:0',
            'hien_thi' => 'boolean',
        ]);

        $sanPham = SanPham::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tạo sản phẩm thành công',
            'data' => $sanPham->load('danhMuc')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $sanPham = SanPham::with('danhMuc')->find($id);

        if (!$sanPham) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $sanPham
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $sanPham = SanPham::find($id);

        if (!$sanPham) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm'
            ], 404);
        }

        $validated = $request->validate([
            'ma_danh_muc' => 'sometimes|required|exists:danh_muc,ma_danh_muc',
            'ten_san_pham' => 'sometimes|required|string|max:255',
            'mo_ta' => 'nullable|string',
            'gia_ban' => 'sometimes|required|numeric|min:0',
            'hinh_anh' => 'nullable|string|max:500',
            'so_luong_ton' => 'sometimes|required|integer|min:0',
            'hien_thi' => 'boolean',
        ]);

        $sanPham->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật sản phẩm thành công',
            'data' => $sanPham->load('danhMuc')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $sanPham = SanPham::find($id);

        if (!$sanPham) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm'
            ], 404);
        }

        $sanPham->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa sản phẩm thành công'
        ]);
    }
}
