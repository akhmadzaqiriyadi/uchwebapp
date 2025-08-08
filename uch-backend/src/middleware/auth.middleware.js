// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

// Middleware untuk memeriksa token
exports.protect = (req, res, next) => {
  let token;

  // Cek apakah token ada di header dengan format 'Bearer <token>'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Akses ditolak, tidak ada token.' });
  }

  try {
    // Verifikasi token menggunakan kunci rahasia
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lampirkan data user dari token ke objek request
    req.user = decoded;
    next(); // Lanjutkan ke middleware atau controller berikutnya
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token tidak valid.' });
  }
};

// Middleware untuk memeriksa peran admin
exports.isAdmin = (req, res, next) => {
  // Cek data user yang sudah di-decode oleh middleware 'protect'
  if (req.user && req.user.role === 'ADMIN') {
    next(); // Lanjutkan jika peran adalah ADMIN
  } else {
    res.status(403).json({ success: false, message: 'Akses ditolak. Rute ini hanya untuk Admin.' });
  }
};