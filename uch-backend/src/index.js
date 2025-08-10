// src/index.js
require('dotenv').config(); // Load environment variables first!

const express = require('express');
const cors = require('cors');
const path = require('path'); 
const { testEmailConnection } = require('./services/email.service');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware untuk mengizinkan request dari frontend dan membaca format JSON
app.use(cors());
app.use(express.json());

// --- (2) MIDDLEWARE BARU UNTUK MENYAJIKAN FILE STATIS ---
// Ini akan membuat semua file di dalam folder 'public' bisa diakses dari URL
// Contoh: http://localhost:8000/public/images/namafile.jpg
// __dirname menunjuk ke direktori saat ini ('src'), jadi kita perlu kembali satu level ('../') ke root proyek.
app.use('/public', express.static(path.join(__dirname, '../public')));

// Memuat Rute-rute
const authRoutes = require('./routes/auth.routes');
const bookingRoutes = require('./routes/booking.routes');
const adminRoutes = require('./routes/admin.routes');
const checkinRoutes = require('./routes/checkin.routes');
const articleRoutes = require('./routes/article.routes');
const categoryRoutes = require('./routes/category.routes');
const tagRoutes = require('./routes/tag.routes'); 

// Menggunakan Rute
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);

// Test email connection saat server startup (async, tidak blocking)
testEmailConnection().catch(error => {
  console.warn('⚠️  Email service tidak tersedia saat startup:', error.message);
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan lancar di port ${PORT}`);
});