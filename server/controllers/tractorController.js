const Tractor = require('../models/Tractor');
const User = require('../models/User');

// @desc Fetch all approved & available tractors
// @route GET /api/tractors
const getTractors = async (req, res) => {
  try {
    const { category, district } = req.query;
    let query = { isAvailable: true };

    if (category && category !== 'All') {
      query.category = category;
    }
    if (district) {
      query.district = { $regex: district, $options: 'i' };
    }

    const tractors = await Tractor.find(query).sort({ createdAt: -1 });
    res.json(tractors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Fetch all tractors (Admin view - includes unapproved)
// @route GET /api/tractors/admin/all
const getAllTractorsAdmin = async (req, res) => {
  try {
    const tractors = await Tractor.find({}).sort({ createdAt: -1 });
    res.json(tractors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Fetch tractors listed by the logged-in farmer
// @route GET /api/tractors/my-tractors
const getMyTractors = async (req, res) => {
  try {
    const tractors = await Tractor.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(tractors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Register / Add a tractor to the platform by farmer
// @route POST /api/tractors
const createTractor = async (req, res) => {
  try {
    const {
      tractorName,
      brand,
      modelYear,
      hp,
      registrationNumber,
      implements: tractorImplements,
      category,
      ratePerHour,
      ratePerAcre,
      village,
      district,
      state,
      pincode,
      imageUrl,
    } = req.body;

    if (!tractorName || !hp || !registrationNumber || !ratePerHour) {
      return res.status(400).json({ message: 'Please provide tractor name, HP, registration number, and hourly rate' });
    }

    const tractor = new Tractor({
      owner: req.user._id,
      ownerName: req.user.name,
      ownerPhone: req.user.phone,
      tractorName,
      brand: brand || 'Mahindra',
      modelYear: modelYear || '2023',
      hp: Number(hp),
      registrationNumber,
      implements: Array.isArray(tractorImplements) ? tractorImplements : (tractorImplements ? tractorImplements.split(',').map(s => s.trim()) : ['Rotavator', 'Cultivator']),
      category: category || 'Standard Tractor',
      ratePerHour: Number(ratePerHour),
      ratePerAcre: Number(ratePerAcre || Number(ratePerHour) * 1.25),
      village: village || req.user.village || 'Local Farm',
      district: district || req.user.district || 'Mandya',
      state: state || req.user.state || 'Karnataka',
      pincode: pincode || req.user.pincode || '',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1c?w=600&auto=format&fit=crop&q=80',
      isAvailable: true,
      isApproved: true,
    });

    const savedTractor = await tractor.save();

    // Mark user as tractor owner if not already
    if (!req.user.isTractorOwner) {
      await User.findByIdAndUpdate(req.user._id, { isTractorOwner: true });
    }

    res.status(201).json(savedTractor);
  } catch (error) {
    console.error('Error creating tractor:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc Update tractor listing
// @route PUT /api/tractors/:id
const updateTractor = async (req, res) => {
  try {
    const tractor = await Tractor.findById(req.params.id);

    if (!tractor) {
      return res.status(404).json({ message: 'Tractor not found' });
    }

    // Allow owner or admin to update
    if (tractor.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this vehicle listing' });
    }

    const fields = [
      'tractorName', 'brand', 'modelYear', 'hp', 'registrationNumber',
      'category', 'ratePerHour', 'ratePerAcre', 'village', 'district',
      'state', 'pincode', 'imageUrl', 'isAvailable', 'isApproved'
    ];

    fields.forEach(f => {
      if (req.body[f] !== undefined) tractor[f] = req.body[f];
    });

    if (req.body.implements) {
      tractor.implements = Array.isArray(req.body.implements)
        ? req.body.implements
        : req.body.implements.split(',').map(s => s.trim());
    }

    const updatedTractor = await tractor.save();
    res.json(updatedTractor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete tractor
// @route DELETE /api/tractors/:id
const deleteTractor = async (req, res) => {
  try {
    const tractor = await Tractor.findById(req.params.id);

    if (!tractor) {
      return res.status(404).json({ message: 'Tractor not found' });
    }

    if (tractor.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this tractor' });
    }

    await Tractor.deleteOne({ _id: tractor._id });
    res.json({ message: 'Tractor listing removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTractors,
  getAllTractorsAdmin,
  getMyTractors,
  createTractor,
  updateTractor,
  deleteTractor,
};
