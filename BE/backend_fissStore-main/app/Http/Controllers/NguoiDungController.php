<?php

namespace App\Http\Controllers;

use App\Models\NguoiDung;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class NguoiDungController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $nguoiDungs = NguoiDung::all();
        
        return response()->json([
            'success' => true,
            'data' => $nguoiDungs
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ho_ten' => 'required|string|max:100',
            'email' => 'required|email|max:100|unique:nguoi_dung,email',
            'mat_khau' => 'required|string|min:6',
            'so_dien_thoai' => 'nullable|string|max:20',
            'dia_chi' => 'nullable|string',
        ]);

        $validated['mat_khau'] = Hash::make($validated['mat_khau']);
        $validated['ngay_tao'] = now();

        $nguoiDung = NguoiDung::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tạo người dùng thành công',
            'data' => $nguoiDung
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $nguoiDung = NguoiDung::with('donHangs')->find($id);

        if (!$nguoiDung) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy người dùng'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $nguoiDung
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $nguoiDung = NguoiDung::find($id);

        if (!$nguoiDung) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy người dùng'
            ], 404);
        }

        $validated = $request->validate([
            'ho_ten' => 'sometimes|required|string|max:100',
            'email' => 'sometimes|required|email|max:100|unique:nguoi_dung,email,' . $id . ',ma_nguoi_dung',
            'mat_khau' => 'sometimes|required|string|min:6',
            'so_dien_thoai' => 'nullable|string|max:20',
            'dia_chi' => 'nullable|string',
        ]);

        if (isset($validated['mat_khau'])) {
            $validated['mat_khau'] = Hash::make($validated['mat_khau']);
        }

        $nguoiDung->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật người dùng thành công',
            'data' => $nguoiDung
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $nguoiDung = NguoiDung::find($id);

        if (!$nguoiDung) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy người dùng'
            ], 404);
        }

        $nguoiDung->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa người dùng thành công'
        ]);
    }
}
