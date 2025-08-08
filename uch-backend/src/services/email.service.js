// src/services/email.service.js
const nodemailer = require('nodemailer');

// Konfigurasi transporter menggunakan variabel dari .env
const transporter = nodemailer.createTransport({
  service: 'gmail', // Gunakan service gmail untuk konfigurasi otomatis
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password untuk Gmail
  },
  connectionTimeout: 10000, // 10 detik timeout
  greetingTimeout: 5000, // 5 detik timeout untuk greeting
  socketTimeout: 10000, // 10 detik timeout untuk socket
});

// Fungsi untuk mengirim email
async function sendBookingNotification(to, subject, text) {
  const mailOptions = {
    from: `"UCH Creative Hub" <${process.env.EMAIL_USER}>`, // Nama pengirim
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email berhasil dikirim ke ${to}`);
  } catch (error) {
    console.error(`Gagal mengirim email: ${error.message}`);
    throw error; // Re-throw error agar bisa ditangani di controller
  }
}

// Fungsi untuk test koneksi email
async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log('✅ Koneksi email berhasil dikonfigurasi');
    return true;
  } catch (error) {
    console.error('❌ Gagal mengkonfigurasi email:', error.message);
    return false;
  }
}

module.exports = { sendBookingNotification, testEmailConnection };