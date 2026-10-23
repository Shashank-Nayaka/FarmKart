const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookingsAdmin,
  assignBookingAdmin,
  updateBookingStatusAdmin,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .post(protect, createBooking);

router.get('/my-bookings', protect, getMyBookings);
router.get('/admin/all', protect, adminOnly, getAllBookingsAdmin);

router.route('/:id')
  .get(protect, getBookingById);

router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/assign', protect, adminOnly, assignBookingAdmin);
router.put('/:id/status', protect, adminOnly, updateBookingStatusAdmin);

module.exports = router;
