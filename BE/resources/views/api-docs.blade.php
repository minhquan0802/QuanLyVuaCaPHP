<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Documentation - Hệ thống Bán Hải Sản</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 0;
            margin-bottom: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        
        .base-url {
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        
        .base-url strong {
            color: #667eea;
            font-size: 1.1em;
        }
        
        .base-url code {
            background: #f0f0f0;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 1.1em;
            color: #e74c3c;
        }
        
        .api-section {
            background: white;
            padding: 25px;
            margin-bottom: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .api-section h2 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 1.8em;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            background: #667eea;
            color: white;
            font-weight: 600;
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        .method {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 5px;
            font-weight: bold;
            font-size: 0.85em;
            min-width: 70px;
            text-align: center;
        }
        
        .method-get {
            background: #28a745;
            color: white;
        }
        
        .method-post {
            background: #007bff;
            color: white;
        }
        
        .method-put {
            background: #ffc107;
            color: #333;
        }
        
        .method-delete {
            background: #dc3545;
            color: white;
        }
        
        .endpoint {
            font-family: 'Courier New', monospace;
            color: #e74c3c;
            font-weight: 600;
        }
        
        .code-block {
            background: #2d3748;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 15px 0;
        }
        
        .code-block pre {
            margin: 0;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            line-height: 1.5;
        }
        
        .status-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 0.85em;
            font-weight: 600;
        }
        
        .status-pending { background: #ffc107; color: #333; }
        .status-processing { background: #17a2b8; color: white; }
        .status-completed { background: #28a745; color: white; }
        .status-cancelled { background: #dc3545; color: white; }
        .status-failed { background: #dc3545; color: white; }
        
        .info-box {
            background: #e7f3ff;
            border-left: 4px solid #2196F3;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }
        
        .warning-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }
        
        ul {
            margin-left: 20px;
            margin-top: 10px;
        }
        
        li {
            margin: 8px 0;
        }
        
        .example-title {
            font-weight: 600;
            color: #667eea;
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 1.1em;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>🦐 API Documentation</h1>
            <p>Hệ thống Bán Hải Sản - REST API</p>
        </div>
    </header>

    <div class="container">
        <div class="base-url">
            <strong>Base URL:</strong> <code>{{ url('/api') }}</code>
        </div>

        <!-- API Danh Mục -->
        <div class="api-section">
            <h2>1. API Danh Mục</h2>
            <table>
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Endpoint</th>
                        <th>Mô tả</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="method method-get">GET</span></td>
                        <td><span class="endpoint">/danh-muc</span></td>
                        <td>Lấy tất cả danh mục</td>
                    </tr>
                    <tr>
                        <td><span class="method method-post">POST</span></td>
                        <td><span class="endpoint">/danh-muc</span></td>
                        <td>Tạo danh mục mới</td>
                    </tr>
                    <tr>
                        <td><span class="method method-get">GET</span></td>
                        <td><span class="endpoint">/danh-muc/{id}</span></td>
                        <td>Xem chi tiết danh mục</td>
                    </tr>
                    <tr>
                        <td><span class="method method-put">PUT</span></td>
                        <td><span class="endpoint">/danh-muc/{id}</span></td>
                        <td>Cập nhật danh mục</td>
                    </tr>
                    <tr>
                        <td><span class="method method-delete">DELETE</span></td>
                        <td><span class="endpoint">/danh-muc/{id}</span></td>
                        <td>Xóa danh mục</td>
                    </tr>
                </tbody>
            </table>

            <div class="example-title">📝 Request Body - Tạo Danh Mục:</div>
            <div class="code-block">
                <pre>{
  "ten_danh_muc": "Hải sản tươi sống",
  "mo_ta": "Các loại hải sản tươi ngon"
}</pre>
            </div>
        </div>

        <!-- API Sản Phẩm -->
        <div class="api-section">
            <h2>2. API Sản Phẩm</h2>
            <table>
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Endpoint</th>
                        <th>Mô tả</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="method method-get">GET</span></td>
                        <td><span class="endpoint">/san-pham</span></td>
                        <td>Lấy danh sách sản phẩm (có filter: ma_danh_muc, hien_thi, search)</td>
                    </tr>
                    <tr>
                        <td><span class="method method-post">POST</span></td>
                        <td><span class="endpoint">/san-pham</span></td>
                        <td>Tạo sản phẩm mới</td>
                    </tr>
                    <tr>
                        <td><span class="method method-get">GET</span></td>
                        <td><span class="endpoint">/san-pham/{id}</span></td>
                        <td>Xem chi tiết sản phẩm</td>
                    </tr>
                    <tr>
                        <td><span class="method method-put">PUT</span></td>
                        <td><span class="endpoint">/san-pham/{id}</span></td>
                        <td>Cập nhật sản phẩm</td>
                    </tr>
                    <tr>
                        <td><span class="method method-delete">DELETE</span></td>
                        <td><span class="endpoint">/san-pham/{id}</span></td>
                        <td>Xóa sản phẩm</td>
                    </tr>
                </tbody>
            </table>

            <div class="example-title">📝 Request Body - Tạo Sản Phẩm:</div>
            <div class="code-block">
                <pre>{
  "ma_danh_muc": 1,
  "ten_san_pham": "Tôm sú tươi",
  "mo_ta": "Tôm sú tươi ngon size lớn",
  "gia_ban": 350000,
  "hinh_anh": "https://example.com/image.jpg",
  "so_luong_ton": 50,
  "hien_thi": true
}</pre>
            </div>

            <div class="info-box">
                <strong>💡 Query Params:</strong>
                <ul>
                    <li><code>ma_danh_muc</code> - Lọc theo danh mục</li>
                    <li><code>hien_thi</code> - Lọc theo trạng thái hiển thị (0/1)</li>
                    <li><code>search</code> - Tìm kiếm theo tên sản phẩm</li>
                </ul>
                <div class="example-title">Ví dụ:</div>
                <code>{{ url('/api') }}/san-pham?ma_danh_muc=1&hien_thi=1&search=tôm</code>
            </div>
        </div>

        <!-- API Người Dùng -->
        <div class="api-section">
            <h2>3. API Người Dùng</h2>
            <table>
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Endpoint</th>
                        <th>Mô tả</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="method method-get">GET</span></td>
                        <td><span class="endpoint">/nguoi-dung</span></td>
                        <td>Lấy danh sách người dùng</td>
                    </tr>
                    <tr>
                        <td><span class="method method-post">POST</span></td>
                        <td><span class="endpoint">/nguoi-dung</span></td>
                        <td>Đăng ký người dùng mới</td>
                    </tr>
                    <tr>
                        <td><span class="method method-get">GET</span></td>
                        <td><span class="endpoint">/nguoi-dung/{id}</span></td>
                        <td>Xem chi tiết người dùng + đơn hàng</td>
                    </tr>
                    <tr>
                        <td><span class="method method-put">PUT</span></td>
                        <td><span class="endpoint">/nguoi-dung/{id}</span></td>
                        <td>Cập nhật thông tin người dùng</td>
                    </tr>
                    <tr>
                        <td><span class="method method-delete">DELETE</span></td>
                        <td><span class="endpoint">/nguoi-dung/{id}</span></td>
                        <td>Xóa người dùng</td>
                    </tr>
                </tbody>
            </table>

            <div class="example-title">📝 Request Body - Đăng ký Người Dùng:</div>
            <div class="code-block">
                <pre>{
  "ho_ten": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "mat_khau": "password123",
  "so_dien_thoai": "0901234567",
  "dia_chi": "123 Đường ABC, Quận 1, TP.HCM"
}</pre>
            </div>
        </div>

        <!-- API Đơn Hàng -->
        <div class="api-section">
            <h2>4. API Đơn Hàng</h2>
            <table>
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Endpoint</th>
                        <th>Mô tả</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="method method-get">GET</span></td>
                        <td><span class="endpoint">/don-hang</span></td>
                        <td>Lấy danh sách đơn hàng (có filter: ma_nguoi_dung, trang_thai)</td>
                    </tr>
                    <tr>
                        <td><span class="method method-post">POST</span></td>
                        <td><span class="endpoint">/don-hang</span></td>
                        <td>Tạo đơn hàng mới (tự động tính tổng tiền)</td>
                    </tr>
                    <tr>
                        <td><span class="method method-get">GET</span></td>
                        <td><span class="endpoint">/don-hang/{id}</span></td>
                        <td>Xem chi tiết đơn hàng</td>
                    </tr>
                    <tr>
                        <td><span class="method method-put">PUT</span></td>
                        <td><span class="endpoint">/don-hang/{id}</span></td>
                        <td>Cập nhật trạng thái đơn hàng</td>
                    </tr>
                    <tr>
                        <td><span class="method method-delete">DELETE</span></td>
                        <td><span class="endpoint">/don-hang/{id}</span></td>
                        <td>Xóa đơn hàng</td>
                    </tr>
                </tbody>
            </table>

            <div class="example-title">📝 Request Body - Tạo Đơn Hàng:</div>
            <div class="code-block">
                <pre>{
  "ma_nguoi_dung": 1,
  "dia_chi_giao_hang": "123 Đường XYZ, Quận 1, TP.HCM",
  "ghi_chu": "Giao hàng buổi chiều",
  "chi_tiet": [
    {
      "ma_san_pham": 1,
      "so_luong": 2
    },
    {
      "ma_san_pham": 3,
      "so_luong": 1
    }
  ]
}</pre>
            </div>

            <div class="info-box">
                <strong>📊 Trạng thái đơn hàng:</strong>
                <ul>
                    <li><span class="status-badge status-pending">pending</span> - Chờ xử lý</li>
                    <li><span class="status-badge status-processing">processing</span> - Đang xử lý</li>
                    <li><span class="status-badge status-completed">completed</span> - Hoàn thành</li>
                    <li><span class="status-badge status-cancelled">cancelled</span> - Đã hủy</li>
                </ul>
            </div>
        </div>

        <!-- API Thanh Toán -->
        <div class="api-section">
            <h2>5. API Thanh Toán</h2>
            <table>
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Endpoint</th>
                        <th>Mô tả</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="method method-get">GET</span></td>
                        <td><span class="endpoint">/thanh-toan</span></td>
                        <td>Lấy danh sách thanh toán (có filter: trang_thai, phuong_thuc)</td>
                    </tr>
                    <tr>
                        <td><span class="method method-post">POST</span></td>
                        <td><span class="endpoint">/thanh-toan</span></td>
                        <td>Tạo thanh toán mới</td>
                    </tr>
                    <tr>
                        <td><span class="method method-get">GET</span></td>
                        <td><span class="endpoint">/thanh-toan/{id}</span></td>
                        <td>Xem chi tiết thanh toán</td>
                    </tr>
                    <tr>
                        <td><span class="method method-put">PUT</span></td>
                        <td><span class="endpoint">/thanh-toan/{id}</span></td>
                        <td>Cập nhật trạng thái thanh toán</td>
                    </tr>
                    <tr>
                        <td><span class="method method-delete">DELETE</span></td>
                        <td><span class="endpoint">/thanh-toan/{id}</span></td>
                        <td>Xóa thanh toán</td>
                    </tr>
                </tbody>
            </table>

            <div class="example-title">📝 Request Body - Tạo Thanh Toán:</div>
            <div class="code-block">
                <pre>{
  "ma_don_hang": 1,
  "phuong_thuc": "credit_card",
  "so_tien": 1500000,
  "noi_dung": "Thanh toán đơn hàng #1"
}</pre>
            </div>

            <div class="info-box">
                <strong>💳 Phương thức thanh toán:</strong>
                <ul>
                    <li><code>cash</code> - Tiền mặt</li>
                    <li><code>credit_card</code> - Thẻ tín dụng</li>
                    <li><code>bank_transfer</code> - Chuyển khoản</li>
                    <li><code>e_wallet</code> - Ví điện tử</li>
                </ul>
            </div>

            <div class="info-box">
                <strong>📊 Trạng thái thanh toán:</strong>
                <ul>
                    <li><span class="status-badge status-pending">pending</span> - Chờ thanh toán</li>
                    <li><span class="status-badge status-completed">completed</span> - Đã thanh toán</li>
                    <li><span class="status-badge status-failed">failed</span> - Thất bại</li>
                    <li><span class="status-badge status-cancelled">refunded</span> - Đã hoàn tiền</li>
                </ul>
            </div>
        </div>

        <!-- Response Format -->
        <div class="api-section">
            <h2>📤 Response Format</h2>
            
            <div class="example-title">Success Response:</div>
            <div class="code-block">
                <pre>{
  "success": true,
  "data": {...} hoặc [...]
}</pre>
            </div>

            <div class="example-title">Error Response:</div>
            <div class="code-block">
                <pre>{
  "success": false,
  "message": "Thông báo lỗi chi tiết"
}</pre>
            </div>

            <div class="warning-box">
                <strong>⚠️ HTTP Status Codes:</strong>
                <ul>
                    <li><code>200</code> - OK (Thành công)</li>
                    <li><code>201</code> - Created (Tạo mới thành công)</li>
                    <li><code>404</code> - Not Found (Không tìm thấy)</li>
                    <li><code>422</code> - Unprocessable Entity (Lỗi validation)</li>
                    <li><code>500</code> - Internal Server Error (Lỗi server)</li>
                </ul>
            </div>
        </div>
    </div>

    <div style="text-align: center; padding: 30px; color: #999;">
        <p>© 2025 Hệ thống Bán Hải Sản - Laravel API Documentation</p>
    </div>
</body>
</html>
