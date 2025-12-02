const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET /api/cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    return res.json(cart);
  } catch (err) {
    console.error('Get cart error:', err);
    return res.status(500).json({ message: 'Lỗi server khi lấy giỏ hàng' });
  }
};

// POST /api/cart/add  { productId, quantity }
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity <= 0) {
      return res.status(400).json({ message: 'productId và quantity > 0 là bắt buộc' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity }],
      });
      return res.status(201).json(cart);
    }

    const existingItem = cart.items.find((item) => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    return res.json(cart);
  } catch (err) {
    console.error('Add to cart error:', err);
    return res.status(500).json({ message: 'Lỗi server khi thêm vào giỏ hàng' });
  }
};

// PUT /api/cart/update  { productId, quantity }
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || quantity == null) {
      return res.status(400).json({ message: 'productId và quantity là bắt buộc' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Chưa có giỏ hàng' });
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'Sản phẩm không có trong giỏ' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    return res.json(cart);
  } catch (err) {
    console.error('Update cart item error:', err);
    return res.status(500).json({ message: 'Lỗi server khi cập nhật giỏ hàng' });
  }
};

// DELETE /api/cart/remove/:productId
exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Chưa có giỏ hàng' });
    }

    const prevLength = cart.items.length;
    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);

    if (cart.items.length === prevLength) {
      return res.status(404).json({ message: 'Sản phẩm không có trong giỏ' });
    }

    await cart.save();
    return res.json(cart);
  } catch (err) {
    console.error('Remove cart item error:', err);
    return res.status(500).json({ message: 'Lỗi server khi xóa sản phẩm khỏi giỏ hàng' });
  }
};


