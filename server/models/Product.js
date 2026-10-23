const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Seeds', 'Fertilizers', 'Pesticides', 'Tools & Machinery', 'Bio-Nutrients'],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  unit: {
    type: String,
    default: 'Pack',
  },
  brand: {
    type: String,
    default: 'AgriGold',
  },
  description: {
    type: String,
    required: true,
  },
  keyFeatures: {
    type: [String],
    default: [],
  },
  imageUrl: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 12,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const MongooseProduct = mongoose.model('Product', productSchema);
const createModelAdapter = require('./modelAdapter');

module.exports = createModelAdapter(MongooseProduct, 'products');

