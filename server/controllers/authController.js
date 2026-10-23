const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'farmkart_super_secret_jwt_key_2026_cse_project', {
    expiresIn: '30d',
  });
};

// @desc Register new user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, village, district, state, pincode, isTractorOwner } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please provide all required fields (name, email, phone, password)' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role === 'admin' ? 'admin' : 'farmer',
      village: village || '',
      district: district || '',
      state: state || 'Karnataka',
      pincode: pincode || '',
      isTractorOwner: isTractorOwner || false,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        village: user.village,
        district: user.district,
        state: user.state,
        pincode: user.pincode,
        isTractorOwner: user.isTractorOwner,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Authenticate user & get token
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Allow login by email or phone
    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone: email }]
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        village: user.village,
        district: user.district,
        state: user.state,
        pincode: user.pincode,
        isTractorOwner: user.isTractorOwner,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email/phone or password' });
    }
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in user profile
// @route GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.village = req.body.village !== undefined ? req.body.village : user.village;
      user.district = req.body.district !== undefined ? req.body.district : user.district;
      user.state = req.body.state !== undefined ? req.body.state : user.state;
      user.pincode = req.body.pincode !== undefined ? req.body.pincode : user.pincode;
      user.isTractorOwner = req.body.isTractorOwner !== undefined ? req.body.isTractorOwner : user.isTractorOwner;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        village: updatedUser.village,
        district: updatedUser.district,
        state: updatedUser.state,
        pincode: updatedUser.pincode,
        isTractorOwner: updatedUser.isTractorOwner,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all registered users (Admin only)
// @route GET /api/auth/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
};
