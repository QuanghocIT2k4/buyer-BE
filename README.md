# Buyer Backend API - Node.js/Express/MongoDB

Backend API đơn giản cho buyer flow trong e-commerce: Auth, Products, Cart, Orders.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (MongoDB Atlas)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt

## 📋 Prerequisites

- Node.js (v14+)
- MongoDB Atlas account (hoặc MongoDB local)
- npm hoặc yarn

## ⚙️ Setup

1. **Clone repository và cài đặt dependencies:**

```bash
cd buyer-BE
npm install
```

2. **Tạo file `.env` trong thư mục `buyer-BE`:**

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
```

3. **Chạy server:**

```bash
# Development (với nodemon auto-reload)
npm run dev

# Production
npm start
```

Server sẽ chạy tại `http://localhost:5000`

4. **Seed dữ liệu mẫu (tùy chọn):**

```bash
npm run seed
# hoặc
node src/seed/seedProducts.js
```

Script này sẽ tạo 8 sản phẩm mẫu (iPhone, Samsung, MacBook, AirPods, iPad, Sony headphone, Dell XPS, Xiaomi) để test API.

## 📚 API Endpoints

### 🔐 Authentication

- **POST** `/api/auth/register`  
  Đăng ký user mới  
  Body: `{ "name": "string", "email": "string", "password": "string" }`

- **POST** `/api/auth/login`  
  Đăng nhập, trả về JWT token  
  Body: `{ "email": "string", "password": "string" }`  
  Response: `{ "message": "Login successful", "token": "jwt_token", "user": {...} }`

### 📦 Products

- **GET** `/api/products`  
  Lấy danh sách tất cả sản phẩm (public, không cần auth)

- **GET** `/api/products/:id`  
  Lấy chi tiết sản phẩm theo ID (public, không cần auth)

### 🛒 Cart (Cần authentication)

Tất cả route cart đều yêu cầu header: `Authorization: Bearer <token>`

- **GET** `/api/cart`  
  Lấy giỏ hàng của user hiện tại

- **POST** `/api/cart/add`  
  Thêm sản phẩm vào giỏ hàng  
  Body: `{ "productId": "string", "quantity": number }`

- **PUT** `/api/cart/update`  
  Cập nhật số lượng sản phẩm trong giỏ  
  Body: `{ "productId": "string", "quantity": number }`

- **DELETE** `/api/cart/remove/:productId`  
  Xóa sản phẩm khỏi giỏ hàng

### 📋 Orders (Cần authentication)

Tất cả route orders đều yêu cầu header: `Authorization: Bearer <token>`

- **POST** `/api/orders`  
  Tạo đơn hàng từ giỏ hàng hiện tại (sau đó clear cart)  
  Body: `{ "paymentMethod": "COD" | "ONLINE" }`  
  Response: Order mới được tạo với `paymentStatus: "PAID_FAKE"` và `status: "PENDING"`

- **GET** `/api/orders/my`  
  Lấy lịch sử đơn hàng của user hiện tại

## 🗂️ Cấu trúc thư mục

```
buyer-BE/
├── src/
│   ├── config/
│   │   └── db.js              # Kết nối MongoDB
│   ├── controllers/
│   │   ├── authController.js  # Logic xử lý Auth
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── middlewares/
│   │   └── authMiddleware.js  # JWT verification middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── seed/
│   │   └── seedProducts.js   # Script seed dữ liệu mẫu
│   └── server.js              # Entry point
├── .env                       # Environment variables
├── package.json
└── README.md
```

## 🧪 Testing với Postman

1. **Đăng ký user:**
   - POST `http://localhost:5000/api/auth/register`
   - Body: `{ "name": "Test User", "email": "test@example.com", "password": "123456" }`

2. **Đăng nhập lấy token:**
   - POST `http://localhost:5000/api/auth/login`
   - Body: `{ "email": "test@example.com", "password": "123456" }`
   - Copy `token` từ response

3. **Thêm vào giỏ hàng:**
   - POST `http://localhost:5000/api/cart/add`
   - Headers: `Authorization: Bearer <token>`
   - Body: `{ "productId": "<product_id>", "quantity": 2 }`

4. **Tạo đơn hàng:**
   - POST `http://localhost:5000/api/orders`
   - Headers: `Authorization: Bearer <token>`
   - Body: `{ "paymentMethod": "COD" }`

5. **Xem lịch sử đơn:**
   - GET `http://localhost:5000/api/orders/my`
   - Headers: `Authorization: Bearer <token>`

## 📝 Notes

- Backend này được xây dựng với mục đích **học tập và demo**, không phải production-ready.
- Tất cả payment đều là **fake** (`paymentStatus: "PAID_FAKE"`) để demo flow.
- Database sử dụng MongoDB Atlas (cloud) hoặc MongoDB local tùy cấu hình trong `.env`.

