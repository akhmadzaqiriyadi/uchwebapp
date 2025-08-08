// src/index.js
require('dotenv').config(); // Load environment variables first!

const express = require('express');
const cors = require('cors');
const { testEmailConnection } = require('./services/email.service');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware untuk mengizinkan request dari frontend dan membaca format JSON
app.use(cors());
app.use(express.json());

// Memuat Rute-rute
const authRoutes = require('./routes/auth.routes');
const bookingRoutes = require('./routes/booking.routes');
const adminRoutes = require('./routes/admin.routes');
const checkinRoutes = require('./routes/checkin.routes');

// Menggunakan Rute
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/checkin', checkinRoutes);

// Test email connection saat server startup (async, tidak blocking)
testEmailConnection().catch(error => {
  console.warn('⚠️  Email service tidak tersedia saat startup:', error.message);
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan lancar di port ${PORT}`);
});