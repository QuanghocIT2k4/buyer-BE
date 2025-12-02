const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// POST /api/orders  { paymentMethod }
// Tạo order từ cart hiện tại của user, tính totalPrice, rồi clear cart
exports.createOrderFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentMethod = 'COD' } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng đang trống' });
    }

    // Lấy thông tin sản phẩm để tính giá tại thời điểm đặt
    const productIds = cart.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const orderItems = [];
    let totalPrice = 0;

    for (const item of cart.items) {
      const prod = productMap.get(item.productId.toString());
      if (!prod) continue;

      const linePrice = prod.price * item.quantity;
      orderItems.push({
        productId: prod._id,
        quantity: item.quantity,
        price: prod.price,
      });
      totalPrice += linePrice;
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: 'Không thể tạo đơn vì sản phẩm không hợp lệ' });
    }

    const order = await Order.create({
      userId,
      items: orderItems,
      totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID_FAKE',
      status: 'PENDING',
    });

    // Clear cart sau khi tạo đơn
    cart.items = [];
    await cart.save();

    return res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng' });
  }
};

// GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).populate('items.productId');
    return res.json(orders);
  } catch (err) {
    console.error('Get my orders error:', err);
    return res.status(500).json({ message: 'Lỗi server khi lấy danh sách đơn hàng' });
  }
};


