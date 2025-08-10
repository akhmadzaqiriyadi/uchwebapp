// src/controllers/article.controller.js
const prisma = require('../db');
const fs = require('fs');
const path = require('path');

// Fungsi kecil untuk membuat 'slug' (bagian dari URL) dari judul artikel.
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

// ===================================================================================
// CREATE - Membuat Artikel Baru
// ===================================================================================
/**
 * @desc    Membuat artikel baru
 * @route   POST /api/articles
 * @access  Private (Hanya Admin/Author)
 */
exports.createArticle = async (req, res) => {
    const { title, content, published, categoryIds, tagNames } = req.body;
    const authorId = req.user.userId;

    // Debug logging
    console.log('User from token:', req.user);
    console.log('Author ID:', authorId);

    if (!title || !content) {
        return res.status(400).json({ success: false, message: 'Judul dan konten wajib diisi.' });
    }
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Gambar utama (featured image) wajib diupload.' });
    }

    const imageUrl = `/images/${req.file.filename}`;

    try {
        // Check if user exists first
        const userExists = await prisma.user.findUnique({
            where: { id: authorId }
        });
        
        if (!userExists) {
            console.log('User not found with ID:', authorId);
            return res.status(400).json({ success: false, message: 'User tidak ditemukan.' });
        }

        console.log('User found:', userExists.name, userExists.email);
        // Parse and validate tagNames
        let parsedTagNames = [];
        if (tagNames && tagNames !== 'undefined') {
            try {
                parsedTagNames = JSON.parse(tagNames);
            } catch (error) {
                console.error('Error parsing tagNames:', error);
                parsedTagNames = [];
            }
        }

        // Parse and validate categoryIds
        let parsedCategoryIds = [];
        if (categoryIds && categoryIds !== 'undefined') {
            try {
                parsedCategoryIds = JSON.parse(categoryIds);
            } catch (error) {
                console.error('Error parsing categoryIds:', error);
                return res.status(400).json({ success: false, message: 'Format kategori tidak valid.' });
            }
        }

        if (parsedCategoryIds.length === 0) {
            return res.status(400).json({ success: false, message: 'Minimal pilih satu kategori.' });
        }

        // Create or find tags
        let createdOrFoundTags = [];
        if (parsedTagNames.length > 0) {
            const tagOperations = parsedTagNames.map(name =>
                prisma.tag.upsert({
                    where: { name: name.trim() },
                    update: {},
                    create: { name: name.trim() },
                })
            );
            createdOrFoundTags = await prisma.$transaction(tagOperations);
        }

        const article = await prisma.article.create({
            data: {
                title,
                slug: generateSlug(title),
                content,
                imageUrl,
                published: published === 'true',
                authorId,
                categories: {
                    connect: parsedCategoryIds.map(id => ({ id: parseInt(id) })),
                },
                tags: {
                    connect: createdOrFoundTags.map(tag => ({ id: tag.id })),
                },
            },
            include: {
                author: { select: { name: true } },
                categories: { select: { id: true, name: true } },
                tags: { select: { id: true, name: true } }
            }
        });

        res.status(201).json({ success: true, message: 'Artikel berhasil dibuat!', data: article });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal membuat artikel.', error: error.message });
    }
};

// ===================================================================================
// READ - Membaca Artikel
// ===================================================================================
/**
 * @desc    Mendapatkan semua artikel dengan filtering
 * @route   GET /api/articles
 * @access  Public (dengan opsi untuk admin melihat draft)
 */
exports.getAllArticles = async (req, res) => {
    const { category, tag, includeUnpublished } = req.query;
    const where = {};

    // Jika includeUnpublished tidak true, hanya tampilkan artikel published
    if (includeUnpublished !== 'true') {
        where.published = true;
    }

    if (category) { where.categories = { some: { name: category } }; }
    if (tag) { where.tags = { some: { name: tag } }; }

    try {
        const articles = await prisma.article.findMany({
            where,
            include: {
                author: { select: { name: true, email: true } },
                categories: { select: { id: true, name: true } },
                tags: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: articles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data artikel.', error: error.message });
    }
};

/**
 * @desc    Mendapatkan detail artikel berdasarkan slug
 * @route   GET /api/articles/:slug
 * @access  Public
 */
exports.getArticleBySlug = async (req, res) => {
    try {
        const article = await prisma.article.findUnique({
            where: { slug: req.params.slug },
            include: {
                author: { select: { name: true, email: true } },
                categories: { select: { id: true, name: true } },
                tags: { select: { id: true, name: true } },
            }
        });

        if (!article || !article.published) {
            return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
        }
        res.json({ success: true, data: article });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil artikel.', error: error.message });
    }
};

// ===================================================================================
// UPDATE - Memperbarui Artikel
// ===================================================================================
/**
 * @desc    Memperbarui sebuah artikel
 * @route   PATCH /api/articles/:id
 * @access  Private (Hanya Admin/Author)
 */
exports.updateArticle = async (req, res) => {
    const { id } = req.params;
    const { title, content, published, categoryIds, tagNames } = req.body;
    const currentUser = req.user;

    try {
        const article = await prisma.article.findUnique({ where: { id: parseInt(id) } });
        if (!article) {
            return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
        }

        // Otorisasi: Hanya author asli atau admin yang bisa mengedit
        if (article.authorId !== currentUser.userId && currentUser.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Anda tidak punya izin untuk mengedit artikel ini.' });
        }
        
        let imageUrl = article.imageUrl;
        // Jika ada file gambar baru yang diupload, ganti yang lama
        if (req.file) {
            // Hapus gambar lama jika ada
            if(article.imageUrl){
                const oldPath = path.join(__dirname, '../../', article.imageUrl);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            imageUrl = `/images/${req.file.filename}`;
        }
        
        // Parse and validate tagNames
        let parsedTagNames = [];
        if (tagNames && tagNames !== 'undefined') {
            try {
                parsedTagNames = JSON.parse(tagNames);
            } catch (error) {
                console.error('Error parsing tagNames:', error);
                parsedTagNames = [];
            }
        }

        // Parse and validate categoryIds
        let parsedCategoryIds = [];
        if (categoryIds && categoryIds !== 'undefined') {
            try {
                parsedCategoryIds = JSON.parse(categoryIds);
            } catch (error) {
                console.error('Error parsing categoryIds:', error);
                return res.status(400).json({ success: false, message: 'Format kategori tidak valid.' });
            }
        }

        // Create or find tags
        let createdOrFoundTags = [];
        if (parsedTagNames.length > 0) {
            const tagOperations = parsedTagNames.map(name =>
                prisma.tag.upsert({
                    where: { name: name.trim() },
                    update: {},
                    create: { name: name.trim() },
                })
            );
            createdOrFoundTags = await prisma.$transaction(tagOperations);
        }

        const updateData = {};
        if (title) {
            updateData.title = title;
            updateData.slug = generateSlug(title);
        }
        if (content) updateData.content = content;
        if (published !== undefined) updateData.published = published === 'true';
        if (imageUrl !== article.imageUrl) updateData.imageUrl = imageUrl;

        // Handle categories
        if (parsedCategoryIds.length > 0) {
            updateData.categories = {
                set: parsedCategoryIds.map(catId => ({ id: parseInt(catId) })),
            };
        }

        // Handle tags
        updateData.tags = {
            set: createdOrFoundTags.map(tag => ({ id: tag.id })),
        };

        const updatedArticle = await prisma.article.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                author: { select: { name: true } },
                categories: { select: { id: true, name: true } },
                tags: { select: { id: true, name: true } },
            }
        });

        res.json({ success: true, message: 'Artikel berhasil diperbarui.', data: updatedArticle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui artikel.', error: error.message });
    }
};

// ===================================================================================
// DELETE - Menghapus Artikel
// ===================================================================================
/**
 * @desc    Menghapus sebuah artikel
 * @route   DELETE /api/articles/:id
 * @access  Private (Hanya Admin/Author)
 */
exports.deleteArticle = async (req, res) => {
    const { id } = req.params;
    const currentUser = req.user;

    try {
        const article = await prisma.article.findUnique({ where: { id: parseInt(id) } });

        if (!article) {
            return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
        }

        // Otorisasi: Hanya author asli atau admin yang bisa menghapus
        if (article.authorId !== currentUser.userId && currentUser.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Anda tidak punya izin untuk menghapus artikel ini.' });
        }

        // Hapus file gambar terkait
        if(article.imageUrl){
            const imagePath = path.join(__dirname, '../../', article.imageUrl);
             if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Hapus artikel dari database
        await prisma.article.delete({ where: { id: parseInt(id) } });

        res.json({ success: true, message: 'Artikel berhasil dihapus.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal menghapus artikel.', error: error.message });
    }
};