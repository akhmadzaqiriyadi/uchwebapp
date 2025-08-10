// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Endpoint untuk registrasi pengguna baru
router.post('/register', register);

// Endpoint untuk login pengguna
router.post('/login', login);

// Endpoint untuk mendapatkan profile user yang sedang login
router.get('/profile', protect, getProfile);

module.exports = router;