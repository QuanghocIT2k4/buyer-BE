const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Danh sách sản phẩm
router.get('/', productController.getProducts);

// Chi tiết sản phẩm
router.get('/:id', productController.getProductById);

module.exports = router;


