## Mục tiêu

- Tái sử dụng frontend buyer hiện có.
- Tạo backend Node.js/Express riêng để quản lý các flow người mua (sản phẩm → giỏ → đặt hàng → lịch sử đơn).
- Dùng MongoDB mới cho dự án cá nhân, không phụ thuộc backend Java cũ.

---

## 1. Khởi tạo project backend

1. Tạo thư mục mới (ví dụ `buyer-backend-node`) nằm song song với folder FE.
2. Chạy:
   ```bash
   npm init -y
   npm install express mongoose cors dotenv jsonwebtoken bcrypt
   npm install --save-dev nodemon
   ```
3. Trong `package.json` thêm script: `"dev": "nodemon src/server.js"`.

---

## 2. Cấu trúc thư mục gợi ý

```
buyer-backend-node/
  src/
    server.js
    config/db.js
    models/{User.js,Product.js,Cart.js,Order.js}
    controllers/{auth,product,cart,order}Controller.js
    routes/{auth,product,cart,order}Routes.js
    seed/seedProducts.js
  .env
```

---

## 3. Kết nối MongoDB

1. Tạo database mới trên MongoDB Atlas (hoặc local).
2. File `.env`:
   ```
   PORT=5000
   MONGO_URI=<chuoi ket noi>
   JWT_SECRET=<chuoi bi mat>
   ```
3. `src/config/db.js`: dùng `mongoose.connect` để mở kết nối, in log thành công/thất bại.
4. `src/server.js`: 
   - `require('dotenv').config()`
   - `app.use(cors())`, `app.use(express.json())`
   - Gọi `connectDB()`
   - Mount route: `/api/auth`, `/api/products`, `/api/cart`, `/api/orders`
   - `app.listen(PORT, ...)`

---

## 4. Thiết kế model MongoDB (buyer scope)

| Model    | Field chính                                                                                                 |
|----------|-------------------------------------------------------------------------------------------------------------|
| `User`   | `name`, `email` (unique), `passwordHash`                                                                    |
| `Product`| `name`, `description`, `price`, `imageUrl`, `category`, `stock`                                             |
| `Cart`   | `userId`, `items[{ productId, quantity }]`                                                                  |
| `Order`  | `userId`, `items[{ productId, quantity, price }]`, `totalPrice`, `paymentMethod`, `paymentStatus`, `status` |

Ghi chú: `paymentMethod` chỉ cần `COD` / `ONLINE`; `paymentStatus` có thể `PENDING`, `PAID_FAKE`.

---

## 5. Seed dữ liệu mẫu

1. Tạo file `seed/seedProducts.js` (lấy data từ dự án cũ hoặc tự tạo array).
2. Chạy `node src/seed/seedProducts.js` để insert sản phẩm.
3. Tạo 1–2 user mẫu (dùng script hoặc nhập thủ công trong Mongo Compass).

---

## 6. Thiết kế API

### Auth (`/api/auth`)
- `POST /login`: nhận `email`, `password`; kiểm tra user; trả JWT + info cơ bản.

### Product (`/api/products`)
- `GET /`: danh sách sản phẩm (có thể thêm query phân trang).
- `GET /:id`: chi tiết sản phẩm.

### Cart (`/api/cart`)
- `GET /`: lấy giỏ hàng hiện tại theo userId trong token.
- `POST /add`: `{ productId, quantity }`.
- `PUT /update`: `{ productId, quantity }`.
- `DELETE /remove/:productId`.

### Order (`/api/orders`)
- `POST /`: lấy dữ liệu từ cart → tạo order (paymentMethod: COD/ONLINE, paymentStatus: PAID_FAKE), sau đó xóa cart hoặc clear items.
- `GET /my`: lịch sử đơn hàng của user.

Tất cả route (trừ login, get product) nên dùng middleware xác thực JWT đơn giản.

---

## 7. Kết nối FE hiện tại

1. Thêm `.env` ở FE: `REACT_APP_API_URL=http://localhost:5000/api`.
2. Cập nhật `api.js` (hoặc service) để dùng base URL mới.
3. Buyer pages:
   - Product list/detail → gọi API từ backend Node.
   - Cart page → đổi sang API `/cart`.
   - Checkout → gọi `POST /orders`.
   - Order history → gọi `GET /orders/my`.
4. Đăng nhập FE: tạo form login buyer → lưu token vào localStorage/context → truyền vào header `Authorization`.

---

## 8. Kiểm thử và demo

1. Dùng Postman kiểm tra lần lượt Auth → Product → Cart → Order.
2. Sau khi ổn, chạy FE: đăng nhập user mẫu → thêm sp vào giỏ → đặt hàng → xem lịch sử.
3. Chụp 2–3 ảnh màn hình (Postman + UI flow) để đưa vào CV/portfolio.

---

## 9. Cách ghi vào CV / phỏng vấn

- **Backend**: “Tự xây backend buyer-side bằng Node.js/Express + MongoDB, thiết kế REST API cho sản phẩm, giỏ hàng, đơn hàng, thanh toán mô phỏng.”
- **Frontend**: “Tái sử dụng giao diện React buyer, kết nối sang backend mới thông qua Axios + JWT.”
- **Điểm nhấn**: hiểu rõ toàn bộ quy trình buyer flow, seed dữ liệu, bảo vệ API bằng JWT, test end-to-end.

---

## 10. Lộ trình thực hiện nhanh (tham khảo)

| Ngày | Việc chính                                    |
|------|-----------------------------------------------|
| 1    | Khởi tạo project, cấu hình server, connect DB |
| 2    | Tạo model, seed sản phẩm, seed user           |
| 3    | Viết Auth + Product API                       |
| 4    | Viết Cart API                                 |
| 5    | Viết Order API                                |
| 6    | Tích hợp FE, test Postman                     |
| 7    | Fix bug, hoàn thiện demo, chụp screenshot     |

Có thể linh hoạt chia nhỏ hơn tùy lịch học/làm của bạn.

