# API Documentation - Hệ thống Bán Hải Sản

## Base URL

```
http://localhost/api
```

## 1. API Danh Mục

| Method    | Endpoint         | Mô tả                 | Request Body                              | Response                                       |
| --------- | ---------------- | --------------------- | ----------------------------------------- | ---------------------------------------------- |
| GET       | `/danh-muc`      | Lấy tất cả danh mục   | -                                         | `{success: true, data: [...]}`                 |
| POST      | `/danh-muc`      | Tạo danh mục mới      | `{ten_danh_muc: string, mo_ta: string?}`  | `{success: true, message: "...", data: {...}}` |
| GET       | `/danh-muc/{id}` | Xem chi tiết danh mục | -                                         | `{success: true, data: {...}}`                 |
| PUT/PATCH | `/danh-muc/{id}` | Cập nhật danh mục     | `{ten_danh_muc: string?, mo_ta: string?}` | `{success: true, message: "...", data: {...}}` |
| DELETE    | `/danh-muc/{id}` | Xóa danh mục          | -                                         | `{success: true, message: "..."}`              |

### Ví dụ Request - Tạo Danh Mục

```json
POST /api/danh-muc
{
  "ten_danh_muc": "Hải sản tươi sống",
  "mo_ta": "Các loại hải sản tươi ngon"
}
```

---

## 2. API Sản Phẩm

| Method    | Endpoint         | Mô tả                  | Request Body | Query Params                    | Response                                       |
| --------- | ---------------- | ---------------------- | ------------ | ------------------------------- | ---------------------------------------------- |
| GET       | `/san-pham`      | Lấy danh sách sản phẩm | -            | `ma_danh_muc, hien_thi, search` | `{success: true, data: [...]}`                 |
| POST      | `/san-pham`      | Tạo sản phẩm mới       | See below    | -                               | `{success: true, message: "...", data: {...}}` |
| GET       | `/san-pham/{id}` | Xem chi tiết sản phẩm  | -            | -                               | `{success: true, data: {...}}`                 |
| PUT/PATCH | `/san-pham/{id}` | Cập nhật sản phẩm      | See below    | -                               | `{success: true, message: "...", data: {...}}` |
| DELETE    | `/san-pham/{id}` | Xóa sản phẩm           | -            | -                               | `{success: true, message: "..."}`              |

### Request Body - Tạo/Cập nhật Sản Phẩm

```json
{
    "ma_danh_muc": 1,
    "ten_san_pham": "Tôm sú tươi",
    "mo_ta": "Tôm sú tươi ngon size lớn",
    "gia_ban": 350000,
    "hinh_anh": "https://example.com/image.jpg",
    "so_luong_ton": 50,
    "hien_thi": true
}
```

### Ví dụ Query Params - Lọc Sản Phẩm

```
GET /api/san-pham?ma_danh_muc=1&hien_thi=1&search=tôm
```

---

## 3. API Người Dùng

| Method    | Endpoint           | Mô tả                    | Request Body | Response                                       |
| --------- | ------------------ | ------------------------ | ------------ | ---------------------------------------------- |
| GET       | `/nguoi-dung`      | Lấy danh sách người dùng | -            | `{success: true, data: [...]}`                 |
| POST      | `/nguoi-dung`      | Đăng ký người dùng       | See below    | `{success: true, message: "...", data: {...}}` |
| GET       | `/nguoi-dung/{id}` | Xem chi tiết người dùng  | -            | `{success: true, data: {...}}`                 |
| PUT/PATCH | `/nguoi-dung/{id}` | Cập nhật thông tin       | See below    | `{success: true, message: "...", data: {...}}` |
| DELETE    | `/nguoi-dung/{id}` | Xóa người dùng           | -            | `{success: true, message: "..."}`              |

### Request Body - Đăng ký Người Dùng

```json
{
    "ho_ten": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "mat_khau": "password123",
    "so_dien_thoai": "0901234567",
    "dia_chi": "123 Đường ABC, Quận 1, TP.HCM",
    "role": "customer"
}
```

### Request Body - Cập nhật Người Dùng

```json
{
    "ho_ten": "Nguyễn Văn B",
    "email": "nguyen@example.com",
    "mat_khau": "newpassword123",
    "so_dien_thoai": "0912345678",
    "dia_chi": "Địa chỉ mới",
    "role": "admin"
}

```

---

## 4. API Đơn Hàng

| Method    | Endpoint         | Mô tả                  | Request Body | Query Params                | Response                                       |
| --------- | ---------------- | ---------------------- | ------------ | --------------------------- | ---------------------------------------------- |
| GET       | `/don-hang`      | Lấy danh sách đơn hàng | -            | `ma_nguoi_dung, trang_thai` | `{success: true, data: [...]}`                 |
| POST      | `/don-hang`      | Tạo đơn hàng mới       | See below    | -                           | `{success: true, message: "...", data: {...}}` |
| GET       | `/don-hang/{id}` | Xem chi tiết đơn hàng  | -            | -                           | `{success: true, data: {...}}`                 |
| PUT/PATCH | `/don-hang/{id}` | Cập nhật đơn hàng      | See below    | -                           | `{success: true, message: "...", data: {...}}` |
| DELETE    | `/don-hang/{id}` | Xóa đơn hàng           | -            | -                           | `{success: true, message: "..."}`              |

### Request Body - Tạo Đơn Hàng

```json
{
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
}
```

### Request Body - Cập nhật Đơn Hàng

```json
{
    "trang_thai": "processing",
    "dia_chi_giao_hang": "Địa chỉ mới",
    "ghi_chu": "Ghi chú cập nhật"
}
```

### Trạng thái đơn hàng

-   `pending` - Chờ xử lý
-   `processing` - Đang xử lý
-   `completed` - Hoàn thành
-   `cancelled` - Đã hủy

### Ví dụ Query Params - Lọc Đơn Hàng

```
GET /api/don-hang?ma_nguoi_dung=1&trang_thai=completed
```

---

## 5. API Thanh Toán

| Method    | Endpoint           | Mô tả                    | Request Body | Query Params              | Response                                       |
| --------- | ------------------ | ------------------------ | ------------ | ------------------------- | ---------------------------------------------- |
| GET       | `/thanh-toan`      | Lấy danh sách thanh toán | -            | `trang_thai, phuong_thuc` | `{success: true, data: [...]}`                 |
| POST      | `/thanh-toan`      | Tạo thanh toán           | See below    | -                         | `{success: true, message: "...", data: {...}}` |
| GET       | `/thanh-toan/{id}` | Xem chi tiết thanh toán  | -            | -                         | `{success: true, data: {...}}`                 |
| PUT/PATCH | `/thanh-toan/{id}` | Cập nhật thanh toán      | See below    | -                         | `{success: true, message: "...", data: {...}}` |
| DELETE    | `/thanh-toan/{id}` | Xóa thanh toán           | -            | -                         | `{success: true, message: "..."}`              |

### Request Body - Tạo Thanh Toán

```json
{
    "ma_don_hang": 1,
    "phuong_thuc": "credit_card",
    "so_tien": 1500000,
    "noi_dung": "Thanh toán đơn hàng #1"
}
```

### Request Body - Cập nhật Thanh Toán

```json
{
    "trang_thai": "completed",
    "ma_giao_dich": "TXN123456789",
    "ma_loi": null,
    "thong_bao_loi": null
}
```

### Phương thức thanh toán

-   `cash` - Tiền mặt
-   `credit_card` - Thẻ tín dụng
-   `bank_transfer` - Chuyển khoản
-   `e_wallet` - Ví điện tử

### Trạng thái thanh toán

-   `pending` - Chờ thanh toán
-   `completed` - Đã thanh toán
-   `failed` - Thất bại
-   `refunded` - Đã hoàn tiền

### Ví dụ Query Params - Lọc Thanh Toán

```
GET /api/thanh-toan?trang_thai=completed&phuong_thuc=credit_card
```

---

## Error Response Format

```json
{
    "success": false,
    "message": "Thông báo lỗi chi tiết"
}
```

### HTTP Status Codes

-   `200` - OK (Thành công)
-   `201` - Created (Tạo mới thành công)
-   `404` - Not Found (Không tìm thấy)
-   `422` - Unprocessable Entity (Lỗi validation)
-   `500` - Internal Server Error (Lỗi server)

---

## Validation Rules

### Danh Mục

-   `ten_danh_muc`: bắt buộc, tối đa 100 ký tự
-   `mo_ta`: tùy chọn, text

### Sản Phẩm

-   `ma_danh_muc`: bắt buộc, phải tồn tại trong bảng danh_muc
-   `ten_san_pham`: bắt buộc, tối đa 255 ký tự
-   `gia_ban`: bắt buộc, số, >= 0
-   `so_luong_ton`: bắt buộc, số nguyên, >= 0
-   `hinh_anh`: tùy chọn, tối đa 500 ký tự
-   `hien_thi`: boolean (true/false)

### Người Dùng

-   `ho_ten`: bắt buộc, tối đa 100 ký tự
-   `email`: bắt buộc, email hợp lệ, unique, tối đa 100 ký tự
-   `mat_khau`: bắt buộc, tối thiểu 6 ký tự
-   `so_dien_thoai`: tùy chọn, tối đa 20 ký tự
-   `dia_chi`: tùy chọn, text

### Đơn Hàng

-   `ma_nguoi_dung`: bắt buộc, phải tồn tại
-   `dia_chi_giao_hang`: bắt buộc, text
-   `chi_tiet`: bắt buộc, array, ít nhất 1 item
-   `chi_tiet.*.ma_san_pham`: bắt buộc, phải tồn tại
-   `chi_tiet.*.so_luong`: bắt buộc, số nguyên, >= 1

### Thanh Toán

-   `ma_don_hang`: bắt buộc, phải tồn tại
-   `phuong_thuc`: bắt buộc, phải thuộc [cash, credit_card, bank_transfer, e_wallet]
-   `so_tien`: bắt buộc, số, >= 0
-   `trang_thai`: phải thuộc [pending, completed, failed, refunded]

---

## Testing với Postman/cURL

### Ví dụ cURL - Tạo Sản Phẩm

```bash
curl -X POST http://localhost/api/san-pham \
  -H "Content-Type: application/json" \
  -d '{
    "ma_danh_muc": 1,
    "ten_san_pham": "Tôm hùm Canada",
    "mo_ta": "Tôm hùm nhập khẩu từ Canada",
    "gia_ban": 1800000,
    "hinh_anh": "https://example.com/tom-hum.jpg",
    "so_luong_ton": 20,
    "hien_thi": true
  }'
```

### Ví dụ cURL - Lấy Danh Sách Đơn Hàng

```bash
curl -X GET "http://localhost/api/don-hang?ma_nguoi_dung=1&trang_thai=completed"
```

### Ví dụ cURL - Cập nhật Trạng Thái Thanh Toán

```bash
curl -X PUT http://localhost/api/thanh-toan/1 \
  -H "Content-Type: application/json" \
  -d '{
    "trang_thai": "completed",
    "ma_giao_dich": "TXN789456123"
  }'
```
