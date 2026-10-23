const Booking = require('../models/Booking');
const Tractor = require('../models/Tractor');

// @desc Create a new vehicle / spot mechanic service booking
// @route POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const {
      serviceType,
      farmLocation,
      serviceDate,
      timeSlot,
      estimatedCost,
      paymentMethod,
      assignedTractor,
    } = req.body;

    if (!serviceType || !farmLocation || !farmLocation.village || !farmLocation.talukDistrict) {
      return res.status(400).json({ message: 'Please provide service type and farm location details (village, district)' });
    }

    let initialStatus = 'On The Way';
    let driverName = 'Suresh Kumar (Certified Tractor Pilot)';
    let driverPhone = '9845011223';
    let vehicleDetails = 'Mahindra 575 DI Sarpanch (KA-11-TR-4589)';

    if (serviceType === 'On-Spot Tractor Breakdown Repair & Mechanic') {
      initialStatus = 'On The Way';
      driverName = 'Manjunath (Senior Mobile Field Mechanic)';
      driverPhone = '9845889900';
      vehicleDetails = 'FarmKart Mobile Mechanic Van (KA-01-MV-9900)';
    } else if (assignedTractor) {
      try {
        const tractor = await Tractor.findById(assignedTractor);
        if (tractor) {
          driverName = tractor.ownerName || driverName;
          driverPhone = tractor.ownerPhone || driverPhone;
          vehicleDetails = `${tractor.brand} ${tractor.tractorName} (${tractor.registrationNumber})`;
        }
      } catch (e) {
        console.warn('Could not lookup tractor:', e.message);
      }
    }

    const booking = new Booking({
      user: req.user._id,
      userName: req.user.name,
      userPhone: req.user.phone,
      serviceType,
      farmLocation: {
        village: farmLocation.village,
        landmark: farmLocation.landmark || '',
        talukDistrict: farmLocation.talukDistrict,
        pincode: farmLocation.pincode || '',
        approxAcreOrHours: Number(farmLocation.approxAcreOrHours || 2),
        pricingUnit: farmLocation.pricingUnit || 'Hours',
      },
      serviceDate: serviceDate || new Date().toISOString().split('T')[0],
      timeSlot: timeSlot || 'Immediate / Next Available Slot',
      estimatedCost: Number(estimatedCost || 1200),
      paymentMethod: paymentMethod || 'Cash After Service',
      paymentStatus: paymentMethod === 'UPI Payment' ? 'Paid' : 'Pending',
      status: initialStatus,
      assignedTractor: assignedTractor || undefined,
      assignedDriverName: driverName,
      assignedDriverPhone: driverPhone,
      assignedVehicleDetails: vehicleDetails,
      serviceOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      adminNotes: 'Assigned nearest verified operator dispatched to farm.',
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc Get bookings for the logged-in user
// @route GET /api/bookings/my-bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('assignedTractor')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single booking details
// @route GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('assignedTractor');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only allow booking owner or admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Cancel booking by user
// @route PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'Completed' || booking.status === 'In Progress') {
      return res.status(400).json({ message: 'Cannot cancel an ongoing or completed service' });
    }

    booking.status = 'Cancelled';
    const updated = await booking.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Get all bookings across the platform (Admin only)
// @route GET /api/bookings/admin/all
const getAllBookingsAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('assignedTractor')
      .populate('user', 'name email phone village')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin assigns a tractor/operator/mechanic to the booked location
// @route PUT /api/bookings/:id/assign
const assignBookingAdmin = async (req, res) => {
  try {
    const { tractorId, driverName, driverPhone, vehicleDetails, status, adminNotes } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (tractorId) {
      booking.assignedTractor = tractorId;
      const tractor = await Tractor.findById(tractorId);
      if (tractor) {
        booking.assignedDriverName = driverName || tractor.ownerName;
        booking.assignedDriverPhone = driverPhone || tractor.ownerPhone;
        booking.assignedVehicleDetails = vehicleDetails || `${tractor.brand} ${tractor.tractorName} (${tractor.registrationNumber})`;
      }
    } else {
      if (driverName) booking.assignedDriverName = driverName;
      if (driverPhone) booking.assignedDriverPhone = driverPhone;
      if (vehicleDetails) booking.assignedVehicleDetails = vehicleDetails;
    }

    if (status) booking.status = status;
    else if (booking.status === 'Requested') booking.status = 'Assigned';

    if (adminNotes) booking.adminNotes = adminNotes;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Admin updates booking status / payment status
// @route PUT /api/bookings/:id/status
const updateBookingStatusAdmin = async (req, res) => {
  try {
    const { status, paymentStatus, adminNotes } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (adminNotes !== undefined) booking.adminNotes = adminNotes;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookingsAdmin,
  assignBookingAdmin,
  updateBookingStatusAdmin,
};
