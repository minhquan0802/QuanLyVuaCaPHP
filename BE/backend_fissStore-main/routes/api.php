<?php

use App\Http\Controllers\CheckoutController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DanhMucController;
use App\Http\Controllers\SanPhamController;
use App\Http\Controllers\NguoiDungController;
use App\Http\Controllers\DonHangController;
use App\Http\Controllers\ThanhToanController;

// Danh mục routes
Route::apiResource('danh-muc', DanhMucController::class);

// Sản phẩm routes
Route::apiResource('san-pham', SanPhamController::class);

// Người dùng routes
Route::apiResource('nguoi-dung', NguoiDungController::class);

// Đơn hàng routes
Route::apiResource('don-hang', DonHangController::class);

// Thanh toán routes
Route::apiResource('thanh-toan', ThanhToanController::class);

// THÊM DÒNG NÀY:
Route::post('/login', [NguoiDungController::class, 'login']);

Route::post('/momo_payment', [CheckoutController::class, 'momo_payment']);

Route::post('/save-momo-transaction', [CheckoutController::class, 'saveTransaction']);