// src/routes/article.routes.js
const express = require('express');
const router = express.Router();

// Impor controller dan middleware yang kita perlukan
const {
    createArticle,
    getAllArticles,
    getArticleBySlug,
    updateArticle,
    deleteArticle
} = require('../controllers/article.controller');
const { protect, isAuthorOrAdmin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// ======================================================
// RUTE PUBLIK (Tidak perlu login)
// ======================================================

// GET /api/articles -> Mendapatkan semua artikel yang sudah publish
// Contoh: /api/articles?category=Teknologi&tag=Web
router.get('/', getAllArticles);

// GET /api/articles/:slug -> Mendapatkan satu artikel berdasarkan slug-nya
// Contoh: /api/articles/cara-membuat-api-dengan-nodejs
router.get('/:slug', getArticleBySlug);


// ======================================================
// RUTE PRIVATE (Perlu login sebagai ADMIN atau AUTHOR)
// ======================================================

// POST /api/articles -> Membuat artikel baru
// Middleware akan berjalan berurutan:
// 1. protect: Cek apakah user sudah login (punya token valid).
// 2. isAuthorOrAdmin: Cek apakah user punya peran yang sesuai.
// 3. upload.single('image'): Tangani upload satu file dengan nama field 'image'.
// 4. createArticle: Jalankan fungsi controller jika semua lolos.
router.post('/', protect, isAuthorOrAdmin, upload.single('image'), createArticle);

// PATCH /api/articles/:id -> Memperbarui artikel berdasarkan ID
router.patch('/:id', protect, isAuthorOrAdmin, upload.single('image'), updateArticle);

// DELETE /api/articles/:id -> Menghapus artikel berdasarkan ID
router.delete('/:id', protect, isAuthorOrAdmin, deleteArticle);

module.exports = router;