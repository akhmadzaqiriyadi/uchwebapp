// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

// Endpoint untuk registrasi pengguna baru
router.post('/register', register);

// Endpoint untuk login pengguna
router.post('/login', login);

module.exports = router;