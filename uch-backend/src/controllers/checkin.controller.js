// src/controllers/checkin.controller.js
const prisma = require('../db');

exports.processCheckin = async (req, res) => {
    const { token } = req.body;
    const userId = req.user.userId; // Diambil dari middleware 'protect'

    if (!token) {
        return res.status(400).json({ success: false, message: 'Token QR tidak ditemukan.' });
    }

    try {
        // 1. Cari QR code berdasarkan token
        const qrCode = await prisma.qRCode.findUnique({
            where: { token },
            include: { booking: true },
        });

        // Validasi 1: Apakah token ada?
        if (!qrCode) {
            return res.status(404).json({ success: false, message: 'QR Code tidak valid.' });
        }

        // Validasi 2: Apakah QR code sudah kedaluwarsa?
        if (new Date() > new Date(qrCode.expiresAt)) {
            return res.status(400).json({ success: false, message: 'QR Code sudah kedaluwarsa.' });
        }

        // Validasi 3: Apakah booking ini milik user yang sedang login?
        if (qrCode.booking.userId !== userId) {
             return res.status(403).json({ success: false, message: 'Ini bukan booking milik Anda.' });
        }

        // Validasi 4: Apakah sudah pernah check-in sebelumnya?
        if (qrCode.booking.status === 'Checked-in') {
            return res.status(400).json({ success: false, message: 'Anda sudah melakukan check-in untuk booking ini.' });
        }

        // 5. Jika semua valid, lakukan proses check-in
        // Digunakan transaction untuk memastikan kedua operasi (update dan create) berhasil bersamaan
        const [updatedBooking, checkin] = await prisma.$transaction([
            prisma.booking.update({
                where: { id: qrCode.bookingId },
                data: { status: 'Checked-in' },
            }),
            prisma.checkin.create({
                data: {
                    bookingId: qrCode.bookingId,
                    userId: userId,
                },
            }),
        ]);

        res.json({ success: true, message: 'Check-in berhasil!' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.', error: error.message });
    }
};