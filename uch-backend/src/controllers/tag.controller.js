// src/controllers/tag.controller.js
const prisma = require('../db');

// @desc    Membuat Tag baru
// @route   POST /api/tags
// @access  Private (Admin)
exports.createTag = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, message: "Nama tag wajib diisi." });
    }
    try {
        const tag = await prisma.tag.create({ data: { name } });
        res.status(201).json({ success: true, message: "Tag berhasil dibuat.", data: tag });
    } catch (error) {
        res.status(500).json({ success: false, message: "Nama tag sudah ada atau terjadi error.", error: error.message });
    }
};

// @desc    Mendapatkan semua Tag
// @route   GET /api/tags
// @access  Public
exports.getAllTags = async (req, res) => {
    try {
        const tags = await prisma.tag.findMany();
        res.json({ success: true, data: tags });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal mengambil data tag.", error: error.message });
    }
};

// @desc    Memperbarui Tag
// @route   PATCH /api/tags/:id
// @access  Private (Admin)
exports.updateTag = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const tag = await prisma.tag.update({
            where: { id: parseInt(id) },
            data: { name }
        });
        res.json({ success: true, message: "Tag berhasil diperbarui.", data: tag });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal memperbarui tag.", error: error.message });
    }
};

// @desc    Menghapus Tag
// @route   DELETE /api/tags/:id
// @access  Private (Admin)
exports.deleteTag = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.tag.delete({ where: { id: parseInt(id) } });
        res.json({ success: true, message: "Tag berhasil dihapus." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal menghapus tag.", error: error.message });
    }
};