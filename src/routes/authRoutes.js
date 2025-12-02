const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Đăng ký (tùy dự án có thể chỉ dùng để seed nhanh)
router.post('/register', authController.register);

// Đăng nhập
router.post('/login', authController.login);

module.exports = router;


