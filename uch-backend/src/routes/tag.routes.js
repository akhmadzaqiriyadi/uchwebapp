// src/routes/tag.routes.js
const express = require('express');
const router = express.Router();
const { createTag, getAllTags, updateTag, deleteTag } = require('../controllers/tag.controller');
const { protect, isAdmin } = require('../middleware/auth.middleware');

// Rute Publik untuk melihat semua tag
router.get('/', getAllTags);

// Rute Private (hanya Admin) untuk mengelola tag
router.post('/', protect, isAdmin, createTag);
router.patch('/:id', protect, isAdmin, updateTag);
router.delete('/:id', protect, isAdmin, deleteTag);

module.exports = router;