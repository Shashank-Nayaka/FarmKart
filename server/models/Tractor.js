const mongoose = require('mongoose');

const tractorSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  ownerPhone: {
    type: String,
    required: true,
  },
  tractorName: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    default: 'Mahindra',
  },
  modelYear: {
    type: String,
    default: '2023',
  },
  hp: {
    type: Number,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    trim: true,
  },
  implements: {
    type: [String],
    default: ['Rotavator', 'Cultivator'],
  },
  category: {
    type: String,
    enum: ['Standard Tractor', 'Mini Tractor', 'Heavy Harvester', 'Spot Mechanic & Service'],
    default: 'Standard Tractor',
  },
  ratePerHour: {
    type: Number,
    required: true,
  },
  ratePerAcre: {
    type: Number,
    required: true,
  },
  village: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    default: 'Karnataka',
  },
  pincode: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1c?w=600&auto=format&fit=crop&q=80',
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isApproved: {
    type: Boolean,
    default: true, // Auto-approved for frictionless demo, can be toggled by admin
  },
}, { timestamps: true });

const MongooseTractor = mongoose.model('Tractor', tractorSchema);
const createModelAdapter = require('./modelAdapter');

module.exports = createModelAdapter(MongooseTractor, 'tractors');

