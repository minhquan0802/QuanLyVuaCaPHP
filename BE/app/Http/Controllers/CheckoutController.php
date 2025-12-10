<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MomoTransaction; // Nhớ import Model
use Illuminate\Support\Facades\Log;

//Luu don hang
use App\Models\DonHang;
use App\Models\ChiTietDonHang;
use App\Models\SanPham;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    // Hàm gửi request sang MoMo
    public function execPostRequest($url, $data)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // --- QUAN TRỌNG: THÊM 2 DÒNG NÀY ĐỂ CHẠY TRÊN LOCALHOST ---
        // Bỏ qua kiểm tra bảo mật" khi chạy ở local
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        // --------------------------------------------------------

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data)
        ));
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);

        $result = curl_exec($ch);

        // Kiểm tra lỗi cURL nếu có
        if ($result === false) {
            die('Lỗi cURL: ' . curl_error($ch)); // Hiển thị lỗi nếu không kết nối được
        }

        curl_close($ch);
        return $result;
    }

    // Hàm xử lý thanh toán
    public function momo_payment(Request $request)
    {
        // 1. Nhận số tiền từ form React gửi lên
        // Nếu không có (null), lấy mặc định 10000 để test
        $total = $request->input('total_momo');
        $amount = $total ? (string)$total : "10000";

        // Lấy input có name="order_info_momo" từ form React
        $infoFromFe = $request->input('order_info_momo');

        // Nếu có dữ liệu thì dùng, không thì dùng text mặc định
        $orderInfoFromFE = $infoFromFe ? (string)$infoFromFe : "Thanh toán đơn hàng Minh Quân Fresh";


        // ... Các thông số config giữ nguyên ...
        $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        $partnerCode = 'MOMOBKUN20180529';
        $accessKey = 'klm05TvNBzhg7h7j';
        $secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
        $orderInfo = $orderInfoFromFE;
        $orderId = time() . "";

        // Sửa redirectUrl về trang Localhost React của bạn để sau khi thanh toán xong nó quay về đúng chỗ
        $redirectUrl = "http://localhost:3000/payment-result";
        $ipnUrl = "http://localhost:3000/home";
        $extraData = "";
        $requestId = time() . "";
        $requestType = "payWithMethod"; //payWithATM, captureWallet

        $rawHash = "accessKey=" . $accessKey . "&amount=" . $amount . "&extraData=" . $extraData . "&ipnUrl=" . $ipnUrl . "&orderId=" . $orderId . "&orderInfo=" . $orderInfo . "&partnerCode=" . $partnerCode . "&redirectUrl=" . $redirectUrl . "&requestId=" . $requestId . "&requestType=" . $requestType;
        $signature = hash_hmac("sha256", $rawHash, $secretKey);

        $data = array(
            'partnerCode' => $partnerCode,
            'partnerName' => "Test",
            "storeId" => "MomoTestStore",
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl' => $ipnUrl,
            'lang' => 'vi',
            'extraData' => $extraData,
            'requestType' => $requestType,
            'signature' => $signature
        );

        $result = $this->execPostRequest($endpoint, json_encode($data));
        $jsonResult = json_decode($result, true);

        // 2. Kiểm tra kết quả trả về trước khi Redirect
        if (isset($jsonResult['payUrl'])) {
            return redirect()->to($jsonResult['payUrl']);
        }

        // Nếu không có payUrl, in lỗi ra màn hình để debug thay vì trắng trang
        // Dùng dd() của Laravel để dump dữ liệu
        dd("Lỗi từ MoMo:", $jsonResult);
    }


    public function saveTransaction(Request $request)
    {
        DB::beginTransaction();
        try {
            // 1. Lưu lịch sử giao dịch MoMo
            MomoTransaction::create([
                'partner_code'  => $request->partnerCode,
                'order_id'      => $request->orderId,
                'request_id'    => $request->requestId,
                'amount'        => $request->amount,
                'order_info'    => $request->orderInfo,
                'order_type'    => $request->orderType,
                'trans_id'      => $request->transId,
                'result_code'   => $request->resultCode,
                'message'       => $request->message,
                'pay_type'      => $request->payType,
                'response_time' => $request->responseTime,
                'extra_data'    => $request->extraData,
                'signature'     => $request->signature,
            ]);

            // 2. Nếu thanh toán thành công (resultCode = 0), tiến hành tạo Đơn Hàng
            if ($request->resultCode == 0) {

                // Lấy dữ liệu đơn hàng từ React gửi kèm (nằm trong body request)
                $orderData = $request->input('order_data');

                // --- A. Tạo Đơn Hàng ---
                $donHang = DonHang::create([
                    'ma_nguoi_dung'     => $orderData['ma_nguoi_dung'],
                    'ngay_dat'          => now(),
                    'tong_tien'         => $request->amount, // Lấy số tiền thực tế đã thanh toán qua MoMo
                    'trang_thai'        => 'processing', // Đã thanh toán -> Đang đóng gói
                    'dia_chi_giao_hang' => $orderData['dia_chi_giao_hang'],
                    'ghi_chu'           => $orderData['ghi_chu'] . " (Đã thanh toán MoMo: " . $request->transId . ")",
                ]);

                // --- B. Tạo Chi Tiết ---
                foreach ($orderData['chi_tiet'] as $item) {
                    // Lấy giá gốc từ DB để an toàn (hoặc lấy từ request nếu bạn chấp nhận rủi ro)
                    $sanPham = SanPham::find($item['ma_san_pham']);

                    ChiTietDonHang::create([
                        'ma_don_hang' => $donHang->ma_don_hang,
                        'ma_san_pham' => $item['ma_san_pham'],
                        'so_luong'    => $item['so_luong'],
                        'gia_mua'     => $sanPham ? $sanPham->gia_ban : 0,
                    ]);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Lưu đơn hàng thành công'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Lỗi lưu MoMo/Order: ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi: ' . $e->getMessage()], 500);
        }
    }

    public function vnpay_payment(Request $request)
    {
        $vnp_TmnCode = "RX5WU6CZ"; // Mã website của bạn
        $vnp_HashSecret = "FWZI93E3QQMO1O4Z2BRFYWLSSSEWCUIM"; // Chuỗi bí mật
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        // Config đường dẫn trả về (Frontend React)
        $vnp_Returnurl = "http://localhost:3000/payment-result";

        $vnp_TxnRef = time(); // Mã đơn hàng (duy nhất)

        // LƯU order_data vào session với key là TxnRef
        $orderData = $request->input('order_data');
        session(['vnpay_order_' . $vnp_TxnRef => $orderData]);


        // Thông tin đơn hàng
        // Lấy từ React gửi lên, nếu không có thì lấy mặc định
        $vnp_OrderInfo = $request->input('order_info') ?? "Thanh toan VNPAY";

        $vnp_OrderType = "other";

        // Số tiền (VNPAY yêu cầu nhân 100)
        // Ví dụ: 10.000 VND -> 1000000
        $vnp_Amount = $request->input('total_vnpay') * 100;

        $vnp_Locale = "vn";

        // --- KHẮC PHỤC LỖI WEBSITE CHƯA PHÊ DUYỆT ---
        // Thay vì $request->ip(), ta cứng 127.0.0.1 để Sandbox chấp nhận
        $vnp_IpAddr = "127.0.0.1";

        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        );

        // Sắp xếp dữ liệu để tạo chữ ký (Bắt buộc của VNPAY)
        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        // Tạo URL thanh toán
        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        // Trả về URL cho React để chuyển hướng
        return response()->json([
            'code' => '00',
            'message' => 'success',
            'data' => $vnp_Url
        ]);
    }

    public function saveVnpayTransaction(Request $request)
    {
        // --- 1. CONFIG ---
        // Đảm bảo mã này giống hệt trong vnpay_payment()
        $vnp_HashSecret = "FWZI93E3QQMO1O4Z2BRFYWLSSSEWCUIM";

        $inputData = $request->all();

        // Lấy SecureHash từ VNPAY gửi về
        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';

        // --- 2. LỌC DỮ LIỆU ĐỂ TẠO CHỮ KÝ ---
        // Chỉ lấy các tham số bắt đầu bằng 'vnp_'
        $vnp_Params = [];
        foreach ($inputData as $key => $value) {
            if (substr($key, 0, 4) == "vnp_" && $key != 'vnp_SecureHashType' && $key != 'vnp_SecureHash') {
                $vnp_Params[$key] = $value;
            }
        }

        // --- 3. TẠO CHỮ KÝ ---
        ksort($vnp_Params);
        $i = 0;
        $hashData = "";
        foreach ($vnp_Params as $key => $value) {
            if ($i == 1) {
                $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData = $hashData . urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        //DEBUG
        // Mở file storage/logs/laravel.log để xem kết quả
        // Log::info("VNPAY Check:");
        // Log::info("Hash VNPAY gui: " . $vnp_SecureHash);
        // Log::info("Hash Minh tao: " . $secureHash);
        // Log::info("String de tao Hash: " . $hashData);

        // --- 5. SO SÁNH ---
        if ($secureHash === $vnp_SecureHash) {

            // Check trạng thái giao dịch
            if ($inputData['vnp_ResponseCode'] == '00') {
                // Lấy order_data từ request (Frontend gửi kèm)
                $txnRef = $inputData['vnp_TxnRef'];
                $orderData = $request->input('order_data');

                if (!$orderData) {
                    Log::error('Không tìm thấy dữ liệu đơn hàng từ FE gửi lên', ['txnRef' => $inputData['vnp_TxnRef']]);
                    return response()->json(['code' => '99', 'message' => 'Lỗi dữ liệu đơn hàng (NULL)']);
                }

                // === XỬ LÝ LƯU DB CỦA BẠN ===
                DB::beginTransaction();
                try {
                    $tableName = 'don_hang'; // <--- Tên bảng đơn hàng
                    $detailTableName = 'chi_tiet_don_hang';

                    // 1. LƯU ĐƠN HÀNG
                    $orderId = DB::table($tableName)->insertGetId([
                        'ma_nguoi_dung' => $orderData['ma_nguoi_dung'],
                        'dia_chi_giao_hang' => $orderData['dia_chi_giao_hang'],
                        'tong_tien' => $inputData['vnp_Amount'] / 100,
                        'trang_thai' => 'processing',
                        'ngay_dat' => now(),
                        'ghi_chu' => "Thanh toán qua VNPAY. " . $orderData['ghi_chu'] . " (Mã GD: " . $inputData['vnp_TransactionNo'] . ")",
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    // 2. LƯU CHI TIẾT ĐƠN HÀNG
                    $chiTietData = [];

                    foreach ($orderData['chi_tiet'] as $item) {

                        // Lấy giá bán từ DB
                        $sanPham = SanPham::find($item['ma_san_pham']);

                        $chiTietData[] = [
                            'ma_don_hang' => $orderId,
                            'ma_san_pham' => $item['ma_san_pham'],
                            'so_luong'    => $item['so_luong'],
                            'gia_mua'     => $sanPham ? $sanPham->gia_ban : 0,
                            'created_at'  => now(),
                            'updated_at'  => now()
                        ];
                    }

                    DB::table($detailTableName)->insert($chiTietData);


                    DB::commit();

                    // Log thành công
                    // Log::info("Luu don hang VNPAY thanh cong. ID: " . $orderId);

                    return response()->json(['code' => '00', 'message' => 'Giao dịch thành công và đã lưu đơn hàng']);
                } catch (\Exception $e) {
                    DB::rollBack();
                    // Log lỗi chi tiết để debug
                    Log::error('Lỗi lưu DB sau GD VNPAY', ['error' => $e->getMessage(), 'txnRef' => $inputData['vnp_TxnRef']]);

                    // Vẫn trả về code 00 cho FE hiển thị thành công (vì tiền đã trừ rồi), nhưng báo lỗi nội bộ
                    return response()->json(['code' => '00', 'message' => 'GD thành công nhưng Lỗi lưu DB (Check Log)'], 200);
                }
            } else {
                return response()->json(['code' => '99', 'message' => 'Giao dịch không thành công tại VNPAY']);
            }
        } else {
            return response()->json(['code' => '97', 'message' => 'Lỗi xác thực chữ ký!']);
        }
    }
}
