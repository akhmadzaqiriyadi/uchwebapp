// src/routes/checkin.routes.js
const express = require('express');
const router = express.Router();
const { processCheckin } = require('../controllers/checkin.controller');
const { protect } = require('../middleware/auth.middleware');

// Rute ini harus dilindungi, karena hanya user yang login yang bisa check-in
router.post('/', protect, processCheckin);

module.exports = router;