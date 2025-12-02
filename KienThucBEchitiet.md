## Ghi chú nhanh cho phỏng vấn

- `npm init -y`: khởi tạo project Node, tạo `package.json` chứa thông tin app (name, version, scripts ...) để quản lý dependency.

- `package.json`: hồ sơ project. `scripts` dùng chạy lệnh (ví dụ `"dev": "nodemon src/server.js"`), `dependencies` liệt kê thư viện cần cài.

- `license: "ISC"`: giấy phép mã nguồn mở mặc định của npm, cho phép dùng/chỉnh sửa code miễn giữ credit.

- `npm install express mongoose cors dotenv jsonwebtoken bcrypt`:  
  - **express**: tạo server HTTP, định nghĩa route.  
  - **mongoose**: kết nối + thao tác MongoDB qua model/schema.  
  - **cors**: cho phép frontend domain khác gọi API (Ví dụ FE `localhost:5173` gọi BE `localhost:5000`).  
  - **dotenv**: đọc biến môi trường từ `.env`.  
  - **jsonwebtoken**: tạo/verify JWT cho đăng nhập.  
  - **bcrypt**: hash/check mật khẩu.

- `npm install --save-dev nodemon`: dev tool tự restart server khi sửa code, không deploy lên production.

- Hỏi: “Trong `package.json` thêm script nào để chạy backend?” → thêm `"dev": "nodemon src/server.js"` để dev server tự reload, và `"start": "node src/server.js"` để production chạy bằng `npm start`.

- Hỏi: “Làm sao format lại dấu ngoặc khi lệch?” → trong VS Code bấm `Shift + Alt + F` (hoặc Format Document) để auto-format theo formatter mặc định/Prettier.

- Hỏi: “File `package-lock.json` lưu cái gì mà dài thế?” → đây là file npm tự sinh, ghi lại toàn bộ cây dependency (kể cả dependency con) kèm version/checksum để mọi máy `npm install` ra đúng phiên bản, vì thế mới dài hàng nghìn dòng và không nên sửa tay.

- `package-lock.json`: do npm tạo ra, khóa chính xác phiên bản từng dependency để mọi máy `npm install` ra cùng kết quả.

- `dependencies` vs `devDependencies`:  
  - `dependencies`: thư viện bắt buộc phải có khi app chạy production (express, mongoose, dotenv…).  
  - `devDependencies`: chỉ dùng lúc phát triển, ví dụ `nodemon` để auto reload; khi deploy thật không cần cài.

- **CORS**: chỉ cần khi FE và BE khác origin (protocol/domain/port). Nếu build FE và serve chung domain/port với BE thì không cần. Ví dụ deploy FE lên Vercel và BE lên Render ⇒ phải bật CORS.

- **Render**: dịch vụ cloud để deploy backend (URL dạng `https://ten-app.onrender.com`).  
  **Swagger**: chỉ là tài liệu/Swagger UI mô tả API, không phải nơi deploy backend.

- Cấu trúc thư mục/backend:
  - `src/`: chứa toàn bộ mã nguồn backend.
  - `src/server.js`: file entry khởi chạy Express (import middleware, route, lắng nghe port).
  - `src/config/db.js`: kết nối MongoDB (mongoose.connect, xử lý lỗi).
  - `src/models/`: định nghĩa schema Mongoose (User/Product/Cart/Order).
  - `src/controllers/`: viết logic xử lý từng API (đọc request, gọi model, trả response).
  - `src/routes/`: định nghĩa endpoint Express và map sang controller tương ứng.
  - `src/seed/`: script seed dữ liệu mẫu vào Mongo.

- Hỏi: “File/folder nào chứa logic API?” → Logic nằm trong `controllers/` (business logic), còn `routes/` chỉ map URL → controller để tách trách nhiệm.

- Hỏi: “Cấu trúc này đã đủ chưa, có cần thêm nhánh phụ?” → Đây là xương sống. Khi dự án lớn hơn có thể bổ sung:
  - `middlewares/`: chứa middleware dùng chung (auth JWT, validate request).
  - `utils/` hoặc `helpers/`: các hàm tiện ích (format dữ liệu, tính tổng...).
  - `services/`: tách tầng xử lý business phức tạp, controller gọi service, service thao tác model.
  - `constants/`: lưu enum/trạng thái cố định (orderStatus, paymentMethod).
  - `validators/`: nếu dùng Joi/Zod để validate body.
  Tùy nhu cầu thực tế mới tạo, không cần ngay từ đầu.

- `.env`: nơi lưu biến môi trường (`PORT`, `MONGO_URI`, `JWT_SECRET`). Ưu tiên không commit lên git để bảo mật. Server đọc giá trị qua `process.env.TEN_BIEN`, giúp đổi port/URI/secret mà không sửa code.

- `src/config/db.js`: import mongoose, gọi `mongoose.connect(process.env.MONGO_URI)` trong `try/catch`. Hiểu vì sao cần `process.exit(1)` khi lỗi (dừng server nếu DB không kết nối) và vì sao phải log lỗi để debug khi phỏng vấn.

- `src/server.js`: nắm flow khởi tạo backend: `require('dotenv').config()` để đọc `.env`, tạo `const app = express()`, bật middleware `cors()` + `express.json()` để parse JSON, gọi `connectDB()` trước khi mở API, định nghĩa route mẫu `app.get('/')`, cuối cùng `app.listen(process.env.PORT || 5000, ...)`. Port 5000 chỉ là mặc định, có thể đổi bằng cách sửa biến `PORT` trong `.env`.


### So sánh `async/await + try/catch` và `.then().catch()` (hay bị hỏi)

- **Bản chất**: cả hai đều làm việc với Promise, chỉ khác **cú pháp**:
  - `async/await + try/catch`: viết code bất đồng bộ theo kiểu **giống đồng bộ**, dễ đọc.
  - `.then().catch()`: dùng **chuỗi Promise** với callback.

- **Ví dụ tương đương**:
  - Cách 1 (hay dùng trong controller/service):
    ```js
    try {
      const user = await User.findById(id);
      // xử lý tiếp...
    } catch (err) {
      // handle error
    }
    ```
  - Cách 2 (ít dùng hơn trong controller):
    ```js
    User.findById(id)
      .then((user) => {
        // xử lý tiếp...
      })
      .catch((err) => {
        // handle error
      });
    ```

- **Nên trả lời gì khi phỏng vấn hỏi “nên dùng cái nào?”**  
  - Em **ưu tiên dùng `async/await` với `try/catch`** trong backend (controller, service, DB) vì:
    - Code **dễ đọc, ít callback lồng nhau**, luồng xử lý rõ ràng.
    - Dễ `return`/`throw` ở giữa hàm, dễ dùng `if/else` như code đồng bộ.
  - `.then().catch()` em vẫn nắm, và sẽ dùng cho **đoạn Promise đơn giản/ngắn**, hoặc trong **helper nhỏ**.

- **Điểm cộng khi trả lời**:
  - Nhấn mạnh em hiểu đây chỉ là **hai cách viết khác nhau trên cùng nền tảng Promise**.
  - Em chọn `async/await` cho **khả năng đọc/bảo trì tốt hơn**, nhưng vẫn linh hoạt dùng `.then().catch()` khi cần.

  