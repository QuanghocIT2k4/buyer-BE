const Product = require('../models/Product');

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (err) {
    console.error('Get products error:', err);
    return res.status(500).json({ message: 'Lỗi server khi lấy danh sách sản phẩm' });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    return res.json(product);
  } catch (err) {
    console.error('Get product by id error:', err);
    return res.status(500).json({ message: 'Lỗi server khi lấy chi tiết sản phẩm' });
  }
};


