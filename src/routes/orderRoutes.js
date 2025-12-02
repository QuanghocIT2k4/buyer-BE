const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

// Tất cả API order của buyer đều yêu cầu đăng nhập
router.use(authMiddleware);

// Tạo đơn từ giỏ hàng hiện tại
router.post('/', orderController.createOrderFromCart);

// Lịch sử đơn hàng của user
router.get('/my', orderController.getMyOrders);

module.exports = router;


