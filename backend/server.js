/**
 * Smart City Application - Main Server Entry Point
 * Sets up Express server, connects to MongoDB, and registers all routes
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically (fallback if not using ImageKit)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/users',         require('./routes/userRoutes'));
app.use('/api/complaints',    require('./routes/complaintRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/feedback',      require('./routes/feedbackRoutes'));
app.use('/api/parking',       require('./routes/parkingRoutes'));
app.use('/api/services',      require('./routes/serviceRoutes'));
app.use('/api/reports',       require('./routes/reportRoutes'));

// ─── Root health check ────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Smart City API is running 🏙️', status: 'OK' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Global Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ─── Connect to MongoDB and Start Server ──────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartcity';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
