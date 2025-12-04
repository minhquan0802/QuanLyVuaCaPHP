<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\MomoTransaction; // Nhớ import Model
use Illuminate\Support\Facades\Log;
class CheckoutController extends Controller
{
    // public function momo_payment(Request $request)
    // {
    //     // Duong link tao giao dich
    //     $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

    //     $partnerCode = 'MOMOBKUN20180529';
    //     $accessKey = 'klm05TvNBzhg7h7j';
    //     $secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
    //     $orderInfo = "Thanh toán qua MoMo";
    //     $amount = "10000";
    //     $orderId = time() . "";
    //     $redirectUrl = "http://localhost:3000/payment-result";
    //     $ipnUrl = "http://localhost:3000/payment-result";
    //     $extraData = "";

    //     $requestId = time() . "";
    //     $requestType = "payWithATM"; //captureWithWallet
    //     // $extraData = ($_POST["extraData"] ? $_POST["extraData"] : "");
    //     //before sign HMAC SHA256 signature
    //     $rawHash = "accessKey=" . $accessKey . "&amount=" . $amount . "&extraData=" . $extraData . "&ipnUrl=" . $ipnUrl . "&orderId=" . $orderId . "&orderInfo=" . $orderInfo . "&partnerCode=" . $partnerCode . "&redirectUrl=" . $redirectUrl . "&requestId=" . $requestId . "&requestType=" . $requestType;
    //     $signature = hash_hmac("sha256", $rawHash, $secretKey);
    //     $data = array(
    //         'partnerCode' => $partnerCode,
    //         'partnerName' => "Test",
    //         "storeId" => "MomoTestStore",
    //         'requestId' => $requestId,
    //         'amount' => $amount,
    //         'orderId' => $orderId,
    //         'orderInfo' => $orderInfo,
    //         'redirectUrl' => $redirectUrl,
    //         'ipnUrl' => $ipnUrl,
    //         'lang' => 'vi',
    //         'extraData' => $extraData,
    //         'requestType' => $requestType,
    //         'signature' => $signature
    //     );
    //     $result = $this->execPostRequest($endpoint, json_encode($data));
    //     $jsonResult = json_decode($result, true);  // decode json

    //     //Just a example, please check more in there
    //     // return redirect()->to($jsonResult['payUrl']);
    //     print_r($jsonResult);

    //     // header('Location: ' . $jsonResult['payUrl']); -> DÙNG CHO PHP THÔNG THƯỜNG
    // }

    // public function execPostRequest($url, $data)
    // {
    //     $ch = curl_init($url);
    //     curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    //     curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    //     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    //     curl_setopt(
    //         $ch,
    //         CURLOPT_HTTPHEADER,
    //         array(
    //             'Content-Type: application/json',
    //             'Content-Length: ' . strlen($data)
    //         )
    //     );
    //     curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    //     curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    //     //execute post
    //     $result = curl_exec($ch);
    //     //close connection
    //     curl_close($ch);
    //     return $result;
    // }




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

        // ... Các thông số config giữ nguyên ...
        $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        $partnerCode = 'MOMOBKUN20180529';
        $accessKey = 'klm05TvNBzhg7h7j';
        $secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
        $orderInfo = "Thanh toán đơn hàng";
        $orderId = time() . "";
        
        // Sửa redirectUrl về trang Localhost React của bạn để sau khi thanh toán xong nó quay về đúng chỗ
        $redirectUrl = "http://localhost:3000/home"; 
        $ipnUrl = "http://localhost:3000/home";
        $extraData = "";
        $requestId = time() . "";
        $requestType = "payWithATM";
        
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
    try {
        // Log lại dữ liệu nhận được để debug (xem trong storage/logs/laravel.log)
        Log::info('MoMo Return Data:', $request->all());

        // 1. Kiểm tra xem giao dịch này đã lưu chưa (tránh trùng lặp khi F5)
        // Tìm theo order_id (Mã đơn hàng của bạn)
        $existing = MomoTransaction::where('order_id', $request->orderId)->first();

        if ($existing) {
            return response()->json(['message' => 'Giao dịch đã tồn tại'], 200);
        }

        // 2. Lưu vào Database
        // Lưu ý: Mapping từ param URL (camelCase) sang cột DB (snake_case)
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

        // 3. (Tùy chọn) Cập nhật trạng thái đơn hàng chính
        // Ví dụ: Tìm bảng Orders và update status = 'paid'
        if ($request->resultCode == 0) {
            // $order = Order::where('id', $request->orderId)->first();
            // if ($order) {
            //     $order->status = 'success';
            //     $order->save();
            // }
        }

        return response()->json(['message' => 'Lưu thành công'], 200);

    } catch (\Exception $e) {
        Log::error('Lỗi lưu transaction: ' . $e->getMessage());
        return response()->json(['message' => 'Lỗi server: ' . $e->getMessage()], 500);
    }
}
}
