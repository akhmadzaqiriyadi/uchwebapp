// src/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth.middleware');
const {
  getAllBookings,
  updateBookingStatus,
  generateQRCode
} = require('../controllers/admin.controller');

// Menerapkan middleware ke semua rute di file ini
router.use(protect, isAdmin);

// Rute untuk admin
router.get('/bookings', getAllBookings); // Mendapatkan semua booking
router.patch('/bookings/:id/status', updateBookingStatus); // Mengubah status (approve/reject)
router.post('/bookings/:id/generate-qr', generateQRCode); // Membuat token untuk QR Code

module.exports = router;