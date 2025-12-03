# Hướng Dẫn Sử Dụng API Cho Frontend Developer

## 📋 Mục Lục

1. [Thông Tin Chung](#thông-tin-chung)
2. [Cấu Hình & Setup](#cấu-hình--setup)
3. [Hướng Dẫn Chi Tiết Từng API](#hướng-dẫn-chi-tiết-từng-api)
4. [Best Practices](#best-practices)
5. [Xử Lý Lỗi](#xử-lý-lỗi)
6. [Tips & Tricks](#tips--tricks)

---

## Thông Tin Chung

### Base URL

```
Development: http://localhost:8000/api
Production: https://your-domain.com/api
```

### Response Format

Tất cả API đều trả về format JSON chuẩn:

**Success Response:**

```json
{
  "success": true,
  "data": {...} // hoặc [...]
}
```

**Error Response:**

```json
{
    "success": false,
    "message": "Thông báo lỗi chi tiết"
}
```

### HTTP Status Codes

| Code | Ý nghĩa          | Xử lý Frontend                         |
| ---- | ---------------- | -------------------------------------- |
| 200  | OK               | Hiển thị dữ liệu thành công            |
| 201  | Created          | Thông báo tạo mới thành công           |
| 404  | Not Found        | Thông báo không tìm thấy               |
| 422  | Validation Error | Hiển thị lỗi validation cho từng field |
| 500  | Server Error     | Thông báo lỗi server, yêu cầu thử lại  |

---

## Cấu Hình & Setup

### Axios Configuration (Recommended)

```javascript
// api/config.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Response interceptor để xử lý lỗi tập trung
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            // Server trả về lỗi
            const { status, data } = error.response;

            switch (status) {
                case 404:
                    console.error("Not found:", data.message);
                    break;
                case 422:
                    console.error("Validation error:", data.message);
                    break;
                case 500:
                    console.error("Server error:", data.message);
                    break;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
```

### Fetch API Configuration

```javascript
// api/config.js
const BASE_URL = "http://localhost:8000/api";

export const fetchAPI = async (endpoint, options = {}) => {
    const defaultOptions = {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...defaultOptions,
        ...options,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};
```

---

## Hướng Dẫn Chi Tiết Từng API

## 1. API Danh Mục

### 1.1. Lấy Danh Sách Danh Mục

```javascript
// Axios
import api from "./config";

const getDanhMucs = async () => {
    try {
        const response = await api.get("/danh-muc");
        return response.data; // Array of categories
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

// Fetch API
const getDanhMucs = async () => {
    try {
        const response = await fetchAPI("/danh-muc");
        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }
};
```

**Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "ma_danh_muc": 1,
      "ten_danh_muc": "Hải sản tươi sống",
      "mo_ta": "Các loại hải sản tươi ngon",
      "created_at": "2025-11-29T10:00:00.000000Z",
      "updated_at": "2025-11-29T10:00:00.000000Z",
      "san_phams": [...]
    }
  ]
}
```

**💡 Lưu Ý:**

-   Response bao gồm cả danh sách sản phẩm của từng danh mục (relationship)
-   Dùng để hiển thị menu categories hoặc filter sản phẩm

### 1.2. Tạo Danh Mục Mới

```javascript
const createDanhMuc = async (data) => {
    try {
        const response = await api.post("/danh-muc", {
            ten_danh_muc: data.name,
            mo_ta: data.description,
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 422) {
            // Validation errors
            console.error("Validation errors:", error.response.data);
        }
        throw error;
    }
};
```

**Request Body:**

```json
{
    "ten_danh_muc": "Hải sản tươi sống",
    "mo_ta": "Mô tả danh mục"
}
```

**⚠️ Validation Rules:**

-   `ten_danh_muc`: Bắt buộc, tối đa 100 ký tự
-   `mo_ta`: Tùy chọn

---

## 2. API Sản Phẩm

### 2.1. Lấy Danh Sách Sản Phẩm (Có Filter)

```javascript
const getSanPhams = async (filters = {}) => {
    try {
        const params = new URLSearchParams();

        if (filters.categoryId) {
            params.append("ma_danh_muc", filters.categoryId);
        }
        if (filters.visible !== undefined) {
            params.append("hien_thi", filters.visible ? 1 : 0);
        }
        if (filters.search) {
            params.append("search", filters.search);
        }

        const response = await api.get(`/san-pham?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

// Sử dụng:
// Lấy tất cả sản phẩm
const allProducts = await getSanPhams();

// Lọc theo danh mục
const categoryProducts = await getSanPhams({ categoryId: 1 });

// Lọc theo trạng thái hiển thị
const visibleProducts = await getSanPhams({ visible: true });

// Tìm kiếm
const searchResults = await getSanPhams({ search: "tôm" });

// Kết hợp filters
const filteredProducts = await getSanPhams({
    categoryId: 1,
    visible: true,
    search: "sú",
});
```

**💡 Query Parameters:**

-   `ma_danh_muc` - Filter theo ID danh mục
-   `hien_thi` - Filter theo trạng thái (0/1)
-   `search` - Tìm kiếm theo tên sản phẩm

### 2.2. Tạo Sản Phẩm Mới

```javascript
const createSanPham = async (productData) => {
    try {
        const response = await api.post("/san-pham", {
            ma_danh_muc: productData.categoryId,
            ten_san_pham: productData.name,
            mo_ta: productData.description,
            gia_ban: parseFloat(productData.price),
            hinh_anh: productData.image,
            so_luong_ton: parseInt(productData.stock),
            hien_thi: productData.visible ?? true,
        });
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
```

**⚠️ Validation Rules:**

-   `ma_danh_muc`: Bắt buộc, phải tồn tại trong bảng danh_muc
-   `ten_san_pham`: Bắt buộc, tối đa 255 ký tự
-   `gia_ban`: Bắt buộc, số, >= 0
-   `so_luong_ton`: Bắt buộc, số nguyên, >= 0
-   `hien_thi`: Boolean (true/false)

**💡 Lưu Ý:**

-   Giá tiền nên format: `350000` (không có dấu phẩy)
-   Upload ảnh riêng rồi lưu URL vào field `hinh_anh`

### 2.3. Cập Nhật Sản Phẩm

```javascript
const updateSanPham = async (id, updates) => {
    try {
        const response = await api.put(`/san-pham/${id}`, updates);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

// Sử dụng:
await updateSanPham(1, {
    gia_ban: 400000,
    so_luong_ton: 30,
});
```

---

## 3. API Người Dùng

### 3.1. Đăng Ký Người Dùng

```javascript
const registerUser = async (userData) => {
    try {
        const response = await api.post("/nguoi-dung", {
            ho_ten: userData.fullName,
            email: userData.email,
            mat_khau: userData.password,
            so_dien_thoai: userData.phone,
            dia_chi: userData.address,
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 422) {
            // Email đã tồn tại hoặc validation error
            const errors = error.response.data.errors;
            console.error("Validation errors:", errors);
        }
        throw error;
    }
};
```

**⚠️ Validation Rules:**

-   `ho_ten`: Bắt buộc, tối đa 100 ký tự
-   `email`: Bắt buộc, email hợp lệ, unique (không trùng)
-   `mat_khau`: Bắt buộc, tối thiểu 6 ký tự
-   `so_dien_thoai`: Tùy chọn, tối đa 20 ký tự

**🔒 Bảo Mật:**

-   Mật khẩu tự động được hash ở backend (sử dụng bcrypt)
-   Frontend chỉ cần gửi plain text password
-   Response không bao gồm mật khẩu

### 3.2. Lấy Thông Tin Người Dùng (Kèm Đơn Hàng)

```javascript
const getUserDetail = async (userId) => {
    try {
        const response = await api.get(`/nguoi-dung/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
```

**Response bao gồm:**

-   Thông tin người dùng
-   Danh sách tất cả đơn hàng của người dùng (relationship)

---

## 4. API Đơn Hàng

### 4.1. Tạo Đơn Hàng Mới (QUAN TRỌNG!)

```javascript
const createOrder = async (orderData) => {
    try {
        const response = await api.post("/don-hang", {
            ma_nguoi_dung: orderData.userId,
            dia_chi_giao_hang: orderData.deliveryAddress,
            ghi_chu: orderData.note,
            chi_tiet: orderData.items.map((item) => ({
                ma_san_pham: item.productId,
                so_luong: item.quantity,
            })),
        });
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

// Ví dụ sử dụng:
const cart = [
    { productId: 1, quantity: 2 }, // 2 kg Tôm sú
    { productId: 3, quantity: 1 }, // 1 kg Mực ống
];

const order = await createOrder({
    userId: 1,
    deliveryAddress: "123 Đường ABC, Quận 1, TP.HCM",
    note: "Giao hàng buổi chiều",
    items: cart,
});
```

**💡 Lưu Ý Quan Trọng:**

-   Backend TỰ ĐỘNG tính `tong_tien` dựa trên giá hiện tại của sản phẩm
-   Frontend KHÔNG cần gửi `tong_tien`
-   Backend TỰ ĐỘNG lấy `gia_mua` = `gia_ban` hiện tại
-   Đảm bảo `ma_san_pham` tồn tại trước khi tạo đơn

**⚠️ Validation Rules:**

-   `ma_nguoi_dung`: Bắt buộc, phải tồn tại
-   `dia_chi_giao_hang`: Bắt buộc
-   `chi_tiet`: Bắt buộc, array, ít nhất 1 item
-   `chi_tiet.*.ma_san_pham`: Bắt buộc, phải tồn tại
-   `chi_tiet.*.so_luong`: Bắt buộc, >= 1

### 4.2. Lấy Đơn Hàng Theo User

```javascript
const getUserOrders = async (userId) => {
    try {
        const response = await api.get(`/don-hang?ma_nguoi_dung=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
```

### 4.3. Lọc Đơn Hàng Theo Trạng Thái

```javascript
const getOrdersByStatus = async (status, userId = null) => {
    try {
        const params = new URLSearchParams();
        params.append("trang_thai", status);

        if (userId) {
            params.append("ma_nguoi_dung", userId);
        }

        const response = await api.get(`/don-hang?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

// Ví dụ sử dụng:
const completedOrders = await getOrdersByStatus("completed");
const userPendingOrders = await getOrdersByStatus("pending", 1);
```

**📊 Trạng Thái Đơn Hàng:**

```javascript
const ORDER_STATUS = {
    PENDING: "pending", // Chờ xử lý - Màu vàng
    PROCESSING: "processing", // Đang xử lý - Màu xanh dương
    COMPLETED: "completed", // Hoàn thành - Màu xanh lá
    CANCELLED: "cancelled", // Đã hủy - Màu đỏ
};
```

### 4.4. Cập Nhật Trạng Thái Đơn Hàng

```javascript
const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await api.put(`/don-hang/${orderId}`, {
            trang_thai: status,
        });
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

// Sử dụng:
await updateOrderStatus(1, "processing");
```

### 4.5. Component React Example - Tạo Đơn Hàng

```jsx
import React, { useState } from "react";
import { createOrder } from "./api/orders";

const CheckoutForm = ({ cart, userId }) => {
    const [address, setAddress] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                userId: userId,
                deliveryAddress: address,
                note: note,
                items: cart.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            };

            const result = await createOrder(orderData);

            if (result.success) {
                alert("Đặt hàng thành công!");
                // Redirect to order detail page
                window.location.href = `/orders/${result.data.ma_don_hang}`;
            }
        } catch (error) {
            alert("Đặt hàng thất bại: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Địa chỉ giao hàng"
                required
            />
            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú"
            />
            <button type="submit" disabled={loading}>
                {loading ? "Đang xử lý..." : "Đặt hàng"}
            </button>
        </form>
    );
};
```

---

## 5. API Thanh Toán

### 5.1. Tạo Thanh Toán

```javascript
const createPayment = async (paymentData) => {
    try {
        const response = await api.post("/thanh-toan", {
            ma_don_hang: paymentData.orderId,
            phuong_thuc: paymentData.method,
            so_tien: paymentData.amount,
            noi_dung: paymentData.description,
        });
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

// Sử dụng:
await createPayment({
    orderId: 1,
    method: "credit_card",
    amount: 1500000,
    description: "Thanh toán đơn hàng #1",
});
```

**💳 Phương Thức Thanh Toán:**

```javascript
const PAYMENT_METHODS = {
    CASH: "cash", // Tiền mặt
    CREDIT_CARD: "credit_card", // Thẻ tín dụng
    BANK_TRANSFER: "bank_transfer", // Chuyển khoản
    E_WALLET: "e_wallet", // Ví điện tử (Momo, ZaloPay...)
};
```

**📊 Trạng Thái Thanh Toán:**

```javascript
const PAYMENT_STATUS = {
    PENDING: "pending", // Chờ thanh toán
    COMPLETED: "completed", // Đã thanh toán
    FAILED: "failed", // Thất bại
    REFUNDED: "refunded", // Đã hoàn tiền
};
```

### 5.2. Cập Nhật Trạng Thái Thanh Toán

```javascript
const updatePaymentStatus = async (paymentId, status, transactionId = null) => {
    try {
        const data = { trang_thai: status };

        if (status === "completed" && transactionId) {
            data.ma_giao_dich = transactionId;
        }

        if (status === "failed") {
            data.ma_loi = "ERR001";
            data.thong_bao_loi = "Giao dịch thất bại";
        }

        const response = await api.put(`/thanh-toan/${paymentId}`, data);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
```

---

## Best Practices

### 1. Loading States

```javascript
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);

const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
        const result = await getSanPhams();
        setData(result.data);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};
```

### 2. Error Handling

```javascript
const handleApiError = (error) => {
    if (error.response) {
        const { status, data } = error.response;

        switch (status) {
            case 404:
                return "Không tìm thấy dữ liệu";
            case 422:
                return data.message || "Dữ liệu không hợp lệ";
            case 500:
                return "Lỗi server, vui lòng thử lại sau";
            default:
                return "Có lỗi xảy ra";
        }
    }
    return "Không thể kết nối đến server";
};
```

### 3. Format Giá Tiền

```javascript
const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
};

// Sử dụng:
formatPrice(350000); // "350.000 ₫"
```

### 4. Validate Trước Khi Gửi

```javascript
const validateOrderData = (orderData) => {
    const errors = {};

    if (!orderData.userId) {
        errors.userId = "Vui lòng đăng nhập";
    }

    if (!orderData.deliveryAddress || orderData.deliveryAddress.trim() === "") {
        errors.address = "Địa chỉ giao hàng không được để trống";
    }

    if (!orderData.items || orderData.items.length === 0) {
        errors.items = "Giỏ hàng trống";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
```

---

## Xử Lý Lỗi

### Lỗi Validation (422)

```javascript
try {
    await createSanPham(data);
} catch (error) {
    if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;

        // validationErrors structure:
        // {
        //   "ten_san_pham": ["Tên sản phẩm không được để trống"],
        //   "gia_ban": ["Giá bán phải là số"]
        // }

        // Hiển thị lỗi cho từng field
        Object.keys(validationErrors).forEach((field) => {
            showErrorForField(field, validationErrors[field][0]);
        });
    }
}
```

### Lỗi Not Found (404)

```javascript
try {
    const product = await api.get(`/san-pham/999`);
} catch (error) {
    if (error.response?.status === 404) {
        // Redirect về trang danh sách hoặc hiển thị thông báo
        alert("Không tìm thấy sản phẩm");
        window.location.href = "/products";
    }
}
```

---

## Tips & Tricks

### 1. Debounce Search

```javascript
import { useEffect, useState } from "react";
import { debounce } from "lodash";

const SearchProducts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        const debouncedSearch = debounce(async (term) => {
            if (term.length >= 2) {
                const response = await getSanPhams({ search: term });
                setResults(response.data);
            }
        }, 500);

        debouncedSearch(searchTerm);
    }, [searchTerm]);

    return (
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
        />
    );
};
```

### 2. Pagination (Nếu Cần)

```javascript
const [page, setPage] = useState(1);
const [products, setProducts] = useState([]);

const loadMore = async () => {
    const newProducts = await getSanPhams({ page: page + 1 });
    setProducts([...products, ...newProducts.data]);
    setPage(page + 1);
};
```

### 3. Cache với React Query

```javascript
import { useQuery } from "react-query";

const useProducts = (filters) => {
    return useQuery(["products", filters], () => getSanPhams(filters), {
        staleTime: 5 * 60 * 1000, // Cache 5 phút
        cacheTime: 10 * 60 * 1000,
    });
};

// Sử dụng:
const { data, isLoading, error } = useProducts({ categoryId: 1 });
```

### 4. Optimistic Updates

```javascript
const deleteProduct = async (productId) => {
    // Xóa khỏi UI trước
    setProducts(products.filter((p) => p.ma_san_pham !== productId));

    try {
        await api.delete(`/san-pham/${productId}`);
    } catch (error) {
        // Nếu lỗi, restore lại
        fetchProducts();
        alert("Xóa thất bại");
    }
};
```

---

## Checklist Trước Khi Deploy

-   [ ] Đổi BASE_URL từ localhost sang production URL
-   [ ] Test tất cả các API endpoints
-   [ ] Kiểm tra error handling
-   [ ] Validate dữ liệu ở client-side trước khi gửi
-   [ ] Test với dữ liệu thật
-   [ ] Kiểm tra responsive design
-   [ ] Test performance với nhiều dữ liệu
-   [ ] Setup CORS nếu frontend và backend khác domain

---

## Liên Hệ & Hỗ Trợ

Nếu gặp vấn đề với API, vui lòng:

1. Kiểm tra response status code
2. Kiểm tra console log
3. Kiểm tra network tab trong DevTools
4. Đọc message trong error response

**API Documentation:** http://localhost:8000/api-docs

---

_Last Updated: November 29, 2025_
