// src/middleware/upload.middleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tentukan direktori penyimpanan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/images';
    // Buat direktori jika belum ada
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Buat nama file unik untuk menghindari konflik
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter untuk hanya menerima file gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (JPEG, PNG, GIF) yang diizinkan!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Batas ukuran file 5MB
  },
  fileFilter: fileFilter
});

module.exports = upload;