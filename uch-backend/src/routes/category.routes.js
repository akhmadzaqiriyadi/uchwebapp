// src/routes/category.routes.js
const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { protect, isAdmin } = require('../middleware/auth.middleware');

// Rute Publik untuk melihat semua kategori
router.get('/', getAllCategories);

// Rute Private (hanya Admin) untuk mengelola kategori
router.post('/', protect, isAdmin, createCategory);
router.patch('/:id', protect, isAdmin, updateCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);

module.exports = router;