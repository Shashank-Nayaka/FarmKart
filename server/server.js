const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seedDatabase = require('./utils/seedData');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const tractorRoutes = require('./routes/tractorRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tractors', tractorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/orders', orderRoutes);

// Welcome and status handler for root and /api
app.get(['/', '/api'], (req, res) => {
  res.json({
    message: '🚀 FarmKart Backend REST API Server is LIVE & Operational!',
    database: global.isMongoConnected ? 'MongoDB Atlas Cloud (Connected)' : 'Local Data Engine',
    clientApplicationUrl: 'http://localhost:5173',
    availableEndpoints: {
      health: 'http://localhost:5000/api/health',
      productsCatalog: 'http://localhost:5000/api/products',
      tractorsFleet: 'http://localhost:5000/api/tractors',
      authLogin: 'POST http://localhost:5000/api/auth/login'
    },
    quickTip: 'Open http://localhost:5173 in your browser to interact with the full FarmKart UI (Tractor Booking & Krishi Bazaar)!'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'FarmKart Smart Agriculture Platform API',
    database: global.isMongoConnected ? 'MongoDB Atlas' : 'Local Store',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

// Start Server & Connect to DB
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`[FarmKart API] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`[FarmKart API] API base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('[Fatal Error] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
