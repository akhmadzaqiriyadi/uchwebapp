// src/controllers/category.controller.js
const prisma = require('../db');

// @desc    Membuat Kategori baru
// @route   POST /api/categories
// @access  Private (Admin)
exports.createCategory = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, message: "Nama kategori wajib diisi." });
    }
    try {
        const category = await prisma.category.create({ data: { name } });
        res.status(201).json({ success: true, message: "Kategori berhasil dibuat.", data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: "Nama kategori sudah ada atau terjadi error.", error: error.message });
    }
};

// @desc    Mendapatkan semua Kategori
// @route   GET /api/categories
// @access  Public
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal mengambil data kategori.", error: error.message });
    }
};

// @desc    Memperbarui Kategori
// @route   PATCH /api/categories/:id
// @access  Private (Admin)
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const category = await prisma.category.update({
            where: { id: parseInt(id) },
            data: { name }
        });
        res.json({ success: true, message: "Kategori berhasil diperbarui.", data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal memperbarui kategori.", error: error.message });
    }
};

// @desc    Menghapus Kategori
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.category.delete({ where: { id: parseInt(id) } });
        res.json({ success: true, message: "Kategori berhasil dihapus." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal menghapus kategori.", error: error.message });
    }
};