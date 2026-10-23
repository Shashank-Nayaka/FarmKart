const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userPhone: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
    enum: [
      'Tractor Plowing / Tilling',
      'Crop Sowing / Seeding',
      'Crop Harvesting',
      'Rotavator Field Leveling',
      'Trolley Agri-Transport',
      'On-Spot Tractor Breakdown Repair & Mechanic'
    ],
  },
  farmLocation: {
    village: { type: String, required: true },
    landmark: { type: String, default: '' },
    talukDistrict: { type: String, required: true },
    pincode: { type: String, default: '' },
    approxAcreOrHours: { type: Number, default: 2 },
    pricingUnit: { type: String, enum: ['Hours', 'Acres', 'Fixed Service Visit'], default: 'Hours' }
  },
  serviceDate: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    default: 'Morning (07:00 AM - 11:00 AM)',
  },
  estimatedCost: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash After Service', 'UPI Payment', 'Online'],
    default: 'Cash After Service',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending',
  },
  status: {
    type: String,
    enum: ['Requested', 'Assigned', 'On The Way', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Requested',
  },
  assignedTractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tractor',
  },
  assignedDriverName: {
    type: String,
    default: 'Assigning nearest operator...',
  },
  assignedDriverPhone: {
    type: String,
    default: '',
  },
  assignedVehicleDetails: {
    type: String,
    default: '',
  },
  adminNotes: {
    type: String,
    default: '',
  },
  serviceOtp: {
    type: String,
    default: () => Math.floor(1000 + Math.random() * 9000).toString(),
  }
}, { timestamps: true });

const MongooseBooking = mongoose.model('Booking', bookingSchema);
const createModelAdapter = require('./modelAdapter');

module.exports = createModelAdapter(MongooseBooking, 'bookings');

