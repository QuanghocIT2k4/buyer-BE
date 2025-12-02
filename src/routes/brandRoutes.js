const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Lấy danh sách tất cả brands (Public API)
 *     tags: [Brand Management]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Số trang (0-based)
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng items mỗi trang
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: name
 *         description: Trường để sort
 *       - in: query
 *         name: sortDirection
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Hướng sort
 *     responses:
 *       200:
 *         description: Danh sách brands
 */
router.get('/', brandController.getBrands);

/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     summary: Lấy chi tiết brand theo ID (Public API)
 *     tags: [Brand Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Chi tiết brand
 *       404:
 *         description: Không tìm thấy brand
 */
router.get('/:id', brandController.getBrandById);

module.exports = router;

