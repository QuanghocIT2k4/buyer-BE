const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lấy danh sách tất cả categories (Public API)
 *     tags: [Category Management]
 *     responses:
 *       200:
 *         description: Danh sách categories
 */
router.get('/', categoryController.getCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Lấy chi tiết category theo ID (Public API)
 *     tags: [Category Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Chi tiết category
 *       404:
 *         description: Không tìm thấy category
 */
router.get('/:id', categoryController.getCategoryById);

module.exports = router;

