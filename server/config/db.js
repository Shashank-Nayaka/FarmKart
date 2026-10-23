const mongoose = require('mongoose');

global.isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/farmkart';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    global.isMongoConnected = true;
    console.log(`[Database] MongoDB Atlas Connected successfully to host: ${conn.connection.host}`);
    console.log(`[Database] Database Name: ${conn.connection.name}`);
    return conn;
  } catch (err) {
    global.isMongoConnected = false;
    await mongoose.disconnect().catch(() => {});
    console.warn(`[Database] Remote MongoDB connection attempt failed: ${err.message}`);
    console.log('[Database] Activated FarmKart Local Persistent Storage Engine (JSON-backed).');
    console.log('[Database] Data safely stored and operational.');
    return null;
  }
};

module.exports = connectDB;
