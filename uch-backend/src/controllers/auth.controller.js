// src/controllers/auth.controller.js
const prisma = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, npm, email, prodi, password } = req.body;

  try {
    // Enkripsi password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        npm,
        email,
        prodi,
        password: hashedPassword,
        // role secara otomatis akan menjadi 'USER' sesuai skema
      },
    });

    res.status(201).json({ success: true, message: 'Registrasi berhasil!', userId: user.id });
  } catch (error) {
    // Tangani jika ada error (misal: email atau npm sudah terdaftar)
    res.status(500).json({ success: false, message: 'Gagal mendaftar.', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Email tidak ditemukan.' });
    }

    // Bandingkan password yang diinput dengan yang ada di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Password salah.' });
    }

    // Jika cocok, buat token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role }, // Data yang disimpan di dalam token
      process.env.JWT_SECRET, // Kunci rahasia untuk 'menandatangani' token
      { expiresIn: '1d' } // Token akan kedaluwarsa dalam 1 hari
    );

    res.json({
      success: true,
      message: 'Login berhasil!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        npm: user.npm,
        prodi: user.prodi
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.', error: error.message });
  }
};