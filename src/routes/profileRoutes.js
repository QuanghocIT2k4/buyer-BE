const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

// Tất cả routes đều cần authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Lấy thông tin profile của user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       404:
 *         description: Không tìm thấy user
 */
router.get('/', profileController.getProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Cập nhật thông tin profile
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phone
 *               - dateOfBirth
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               phone:
 *                 type: string
 *                 maxLength: 10
 *                 example: "0123456789"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Thiếu thông tin bắt buộc
 *       404:
 *         description: Không tìm thấy user
 */
router.put('/', profileController.updateProfile);

module.exports = router;

