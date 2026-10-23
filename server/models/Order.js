const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      imageUrl: { type: String, required: true },
      unit: { type: String, default: 'Pack' },
    }
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    villageFarmAddress: { type: String, required: true },
    landmark: { type: String, default: '' },
    district: { type: String, required: true },
    state: { type: String, default: 'Karnataka' },
    pincode: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['UPI', 'Cash on Delivery', 'Card / NetBanking'],
  },
  paymentResult: {
    transactionId: { type: String, default: '' },
    upiId: { type: String, default: '' },
    status: { type: String, default: 'Completed' },
    paidAt: { type: Date }
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  deliveryPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Ordered',
  },
  deliveredAt: {
    type: Date,
  }
}, { timestamps: true });

const MongooseOrder = mongoose.model('Order', orderSchema);
const createModelAdapter = require('./modelAdapter');

module.exports = createModelAdapter(MongooseOrder, 'orders');

