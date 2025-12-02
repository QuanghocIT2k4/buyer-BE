const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middlewares/authMiddleware');

// Tất cả routes đều cần authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Lấy tất cả địa chỉ của user
 *     tags: [Buyer Address Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách địa chỉ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/', addressController.getAddresses);

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Tạo địa chỉ mới
 *     tags: [Buyer Address Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - province
 *               - ward
 *               - homeAddress
 *               - phone
 *             properties:
 *               province:
 *                 type: string
 *                 example: "Hồ Chí Minh"
 *               ward:
 *                 type: string
 *                 example: "Phường 1"
 *               homeAddress:
 *                 type: string
 *                 example: "123 Đường ABC"
 *               phone:
 *                 type: string
 *                 maxLength: 10
 *                 example: "0123456789"
 *               suggestedName:
 *                 type: string
 *                 example: "Nhà riêng"
 *     responses:
 *       201:
 *         description: Tạo địa chỉ thành công
 *       400:
 *         description: Thiếu thông tin bắt buộc
 */
router.post('/', addressController.createAddress);

/**
 * @swagger
 * /api/addresses/check:
 *   get:
 *     summary: Kiểm tra user có địa chỉ không
 *     tags: [Buyer Address Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kết quả kiểm tra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 hasAddress:
 *                   type: boolean
 *                 count:
 *                   type: number
 */
router.get('/check', addressController.checkHasAddress);

/**
 * @swagger
 * /api/addresses/{addressId}:
 *   put:
 *     summary: Cập nhật địa chỉ
 *     tags: [Buyer Address Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               province:
 *                 type: string
 *               ward:
 *                 type: string
 *               homeAddress:
 *                 type: string
 *               phone:
 *                 type: string
 *               suggestedName:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy địa chỉ
 */
router.put('/:addressId', addressController.updateAddress);

/**
 * @swagger
 * /api/addresses/{addressId}:
 *   delete:
 *     summary: Xóa địa chỉ
 *     tags: [Buyer Address Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy địa chỉ
 */
router.delete('/:addressId', addressController.deleteAddress);

module.exports = router;

