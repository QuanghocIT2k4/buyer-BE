require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Dữ liệu sản phẩm mẫu
const sampleProducts = [
  {
    name: 'iPhone 15 Pro Max',
    description: 'Điện thoại iPhone 15 Pro Max 256GB - Chính hãng VN/A',
    price: 29990000,
    imageUrl: 'https://example.com/iphone15.jpg',
    category: 'Điện thoại',
    stock: 50,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Điện thoại Samsung Galaxy S24 Ultra 512GB',
    price: 27990000,
    imageUrl: 'https://example.com/samsung-s24.jpg',
    category: 'Điện thoại',
    stock: 30,
  },
  {
    name: 'MacBook Pro M3 14 inch',
    description: 'Laptop Apple MacBook Pro M3 14 inch 512GB',
    price: 49990000,
    imageUrl: 'https://example.com/macbook-pro.jpg',
    category: 'Laptop',
    stock: 20,
  },
  {
    name: 'AirPods Pro 2',
    description: 'Tai nghe Apple AirPods Pro 2 - Chống ồn chủ động',
    price: 5990000,
    imageUrl: 'https://example.com/airpods-pro.jpg',
    category: 'Phụ kiện',
    stock: 100,
  },
  {
    name: 'iPad Air M2',
    description: 'Máy tính bảng iPad Air M2 256GB WiFi',
    price: 19990000,
    imageUrl: 'https://example.com/ipad-air.jpg',
    category: 'Tablet',
    stock: 40,
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Tai nghe chống ồn Sony WH-1000XM5',
    price: 8990000,
    imageUrl: 'https://example.com/sony-headphone.jpg',
    category: 'Phụ kiện',
    stock: 60,
  },
  {
    name: 'Dell XPS 15',
    description: 'Laptop Dell XPS 15 9530 Intel Core i7',
    price: 42990000,
    imageUrl: 'https://example.com/dell-xps.jpg',
    category: 'Laptop',
    stock: 25,
  },
  {
    name: 'Xiaomi 14 Pro',
    description: 'Điện thoại Xiaomi 14 Pro 256GB',
    price: 19990000,
    imageUrl: 'https://example.com/xiaomi-14.jpg',
    category: 'Điện thoại',
    stock: 80,
  },
];

// Hàm seed dữ liệu
const seedProducts = async () => {
  try {
    // Kết nối DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Xóa tất cả products cũ (optional - comment nếu muốn giữ lại)
    await Product.deleteMany({});
    console.log('Cleared existing products...');

    // Insert products mới
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${createdProducts.length} products successfully!`);

    // In ra danh sách products đã tạo
    console.log('\n📦 Products created:');
    createdProducts.forEach((product, index) => {
      console.log(
        `${index + 1}. ${product.name} - ${product.price.toLocaleString('vi-VN')}đ (Stock: ${product.stock})`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
    process.exit(1);
  }
};

// Chạy seed
seedProducts();

