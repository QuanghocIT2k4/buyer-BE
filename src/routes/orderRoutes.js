const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

// Tất cả API order của buyer đều yêu cầu đăng nhập
router.use(authMiddleware);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo đơn hàng từ giỏ hàng hiện tại
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: [COD, ONLINE]
 *                 example: "COD"
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công
 */
router.post('/', orderController.createOrderFromCart);

/**
 * @swagger
 * /api/orders/my:
 *   get:
 *     summary: Lấy lịch sử đơn hàng của user hiện tại
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 */
router.get('/my', orderController.getMyOrders);

module.exports = router;
