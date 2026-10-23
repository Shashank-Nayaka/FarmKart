const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc Create new e-commerce order with stock deduction
// @route POST /api/orders
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentResult,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items specified' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.villageFarmAddress || !shippingAddress.phone) {
      return res.status(400).json({ message: 'Please provide full delivery address including village and phone' });
    }

    // Check stock for all items in MongoDB before placing order
    for (const item of orderItems) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product "${item.name}" not found in catalog` });
      }
      if (dbProduct.stock < item.qty) {
        return res.status(400).json({
          message: `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.stock} units remaining.`
        });
      }
    }

    // Calculate prices
    let itemsPrice = 0;
    const finalItems = [];

    for (const item of orderItems) {
      const dbProduct = await Product.findById(item.product);
      itemsPrice += dbProduct.price * item.qty;
      finalItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        qty: item.qty,
        price: dbProduct.price,
        imageUrl: dbProduct.imageUrl,
        unit: dbProduct.unit || 'Pack',
      });
    }

    // Free delivery above ₹499, otherwise ₹50 delivery
    const deliveryPrice = itemsPrice >= 500 ? 0 : 50;
    const totalPrice = itemsPrice + deliveryPrice;

    // Create the order
    const order = new Order({
      user: req.user._id,
      customerName: shippingAddress.fullName || req.user.name,
      customerEmail: req.user.email,
      customerPhone: shippingAddress.phone || req.user.phone,
      orderItems: finalItems,
      shippingAddress,
      paymentMethod,
      paymentResult: {
        transactionId: paymentResult?.transactionId || (paymentMethod === 'UPI' ? `UPI-${Date.now().toString().slice(-8)}` : 'COD-PENDING'),
        upiId: paymentResult?.upiId || '',
        status: paymentMethod === 'UPI' ? 'Paid (Verified)' : (paymentMethod === 'Cash on Delivery' ? 'Pay on Delivery' : 'Completed'),
        paidAt: paymentMethod === 'UPI' ? new Date() : undefined,
      },
      itemsPrice,
      deliveryPrice,
      totalPrice,
      orderStatus: 'Ordered',
    });

    const createdOrder = await order.save();

    // Deduct stock in MongoDB dataset for each purchased product
    for (const item of finalItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty }
      });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in user orders
// @route GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get order by ID
// @route GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Cancel an order and restore stock to MongoDB
// @route PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Out for Delivery' || order.orderStatus === 'Delivered') {
      return res.status(400).json({ message: 'Cannot cancel an order that is already shipped or delivered' });
    }

    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    order.orderStatus = 'Cancelled';
    const updatedOrder = await order.save();

    // Restore stock in MongoDB
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.qty }
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all orders (Admin only)
// @route GET /api/orders/admin/all
const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update order status (Admin only)
// @route PUT /api/orders/:id/status
const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    if (orderStatus === 'Delivered') {
      order.deliveredAt = Date.now();
      if (order.paymentMethod === 'Cash on Delivery') {
        order.paymentResult.status = 'Paid on Delivery';
        order.paymentResult.paidAt = new Date();
      }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
};
