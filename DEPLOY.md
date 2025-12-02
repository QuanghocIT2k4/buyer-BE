# 🚀 Hướng dẫn Deploy lên Render

## Bước 1: Chuẩn bị code

1. Đảm bảo code đã commit lên GitHub (hoặc GitLab/Bitbucket)
2. Kiểm tra `package.json` có script `start`:
   ```json
   "scripts": {
     "start": "node src/server.js"
   }
   ```

## Bước 2: Tạo service trên Render

1. Đăng nhập vào [Render.com](https://render.com) (hoặc đăng ký nếu chưa có)
2. Click **"New +"** → Chọn **"Web Service"**
3. Kết nối repository GitHub của bạn
4. Chọn repository chứa `buyer-BE`

## Bước 3: Cấu hình trên Render

### Basic Settings:
- **Name:** `buyer-be` (hoặc tên bạn muốn)
- **Region:** Singapore (gần VN nhất)
- **Branch:** `main` (hoặc branch bạn muốn deploy)
- **Root Directory:** `buyer-BE` (nếu repo có nhiều folder) hoặc để trống nếu repo chỉ có buyer-BE
- **Runtime:** Node
- **Build Command:** `npm install` (hoặc để trống, Render tự detect)
- **Start Command:** `npm start`

### Environment Variables:
Thêm các biến môi trường trong Render Dashboard:

```
PORT=10000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here_very_long_and_random
NODE_ENV=production
```

**Lưu ý:**
- `PORT` trên Render thường là `10000` hoặc Render tự set (không cần hardcode)
- `MONGO_URI` phải là connection string từ MongoDB Atlas
- `JWT_SECRET` nên là chuỗi dài và random để bảo mật

## Bước 4: Deploy

1. Click **"Create Web Service"**
2. Render sẽ tự động build và deploy
3. Đợi vài phút để deploy xong
4. Khi deploy thành công, bạn sẽ có URL dạng: `https://buyer-be-xxxx.onrender.com`

## Bước 5: Test API sau khi deploy

Sau khi deploy xong, test API:

```bash
# Test root endpoint
curl https://buyer-be-xxxx.onrender.com/

# Test products
curl https://buyer-be-xxxx.onrender.com/api/products
```

## ⚠️ Lưu ý quan trọng

1. **Free tier của Render:**
   - Service sẽ **sleep sau 15 phút không có request**
   - Lần đầu wake up có thể mất 30-60 giây
   - Nếu cần 24/7 thì phải upgrade lên paid plan

2. **MongoDB Atlas:**
   - Đảm bảo **Network Access** trong Atlas đã cho phép IP `0.0.0.0/0` (allow from anywhere)
   - Hoặc thêm IP của Render vào whitelist

3. **CORS:**
   - Code đã có `app.use(cors())` nên FE có thể gọi được
   - Nếu cần giới hạn domain cụ thể, sửa trong `server.js`:
     ```js
     app.use(cors({
       origin: ['https://your-fe-domain.vercel.app', 'http://localhost:5173']
     }));
     ```

## 🔗 Sau khi deploy

- **API Base URL:** `https://buyer-be-xxxx.onrender.com`
- **API Endpoints:**
  - Auth: `https://buyer-be-xxxx.onrender.com/api/auth`
  - Products: `https://buyer-be-xxxx.onrender.com/api/products`
  - Cart: `https://buyer-be-xxxx.onrender.com/api/cart`
  - Orders: `https://buyer-be-xxxx.onrender.com/api/orders`

## 📝 Update README

Sau khi deploy xong, cập nhật README với link production:

```markdown
## 🌐 Live Demo

- **API Base URL:** https://buyer-be-xxxx.onrender.com
- **API Documentation:** Xem README.md
```

