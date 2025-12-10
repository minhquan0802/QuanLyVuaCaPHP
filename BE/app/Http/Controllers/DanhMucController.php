<?php

namespace App\Http\Controllers;

use App\Models\DanhMuc;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DanhMucController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $danhMucs = DanhMuc::with('sanPhams')->get();
        
        return response()->json([
            'success' => true,
            'data' => $danhMucs
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ten_danh_muc' => 'required|string|max:100',
            'mo_ta' => 'nullable|string',
        ]);

        $danhMuc = DanhMuc::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tạo danh mục thành công',
            'data' => $danhMuc
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $danhMuc = DanhMuc::with('sanPhams')->find($id);

        if (!$danhMuc) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy danh mục'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $danhMuc
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $danhMuc = DanhMuc::find($id);

        if (!$danhMuc) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy danh mục'
            ], 404);
        }

        $validated = $request->validate([
            'ten_danh_muc' => 'sometimes|required|string|max:100',
            'mo_ta' => 'nullable|string',
        ]);

        $danhMuc->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật danh mục thành công',
            'data' => $danhMuc
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $danhMuc = DanhMuc::find($id);

        if (!$danhMuc) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy danh mục'
            ], 404);
        }

        $danhMuc->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa danh mục thành công'
        ]);
    }
}
