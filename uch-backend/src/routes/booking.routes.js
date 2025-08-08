// src/routes/booking.routes.js
const express = require('express');
const router = express.Router();
const { createBooking, getSchedule, getAvailableSlots, getMyBookingHistory } = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware'); // Impor middleware 'protect'

// Endpoint ini dilindungi, hanya user yang login bisa mengakses
router.post('/', protect, createBooking);

// Endpoint ini publik, semua orang bisa lihat jadwal
router.get('/schedule', getSchedule);

// Endpoint ini publik, semua orang bisa cek slot
router.get('/available-slots', getAvailableSlots);

// Endpoint untuk mendapatkan riwayat booking user
router.get('/my-history', protect, getMyBookingHistory);

module.exports = router;