// src/controllers/admin.controller.js
const prisma = require('../db');
const crypto = require('crypto'); // Library bawaan Node.js untuk generate string acak
const { sendBookingNotification } = require('../services/email.service');

// Mengambil semua data booking
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                user: true, // Sertakan detail user di setiap booking
            },
            orderBy: {
                bookingDate: 'desc', // Urutkan dari yang terbaru
            }
        });
        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data booking.', error: error.message });
    }
};

// Memperbarui status booking (Approve/Reject)
exports.updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // status bisa 'Approved' atau 'Rejected'

    if (!['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Status tidak valid.' });
    }

    try {
        const booking = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: { status },
            include: { user: true },
        });

        // Kirim email notifikasi ke user
        await sendBookingNotification(
            booking.user.email,
            `Status Booking Anda: ${status}`,
            `Halo ${booking.user.name},\n\nBooking Anda untuk ruangan ${booking.room} pada tanggal ${booking.bookingDate.toLocaleDateString()} telah di-${status.toLowerCase()}.\n\nTerima kasih.`
        );

        res.json({ success: true, message: `Booking berhasil di-${status.toLowerCase()}`, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memperbarui status booking.', error: error.message });
    }
};

// Membuat atau mengambil token unik untuk QR Code
exports.generateQRCode = async (req, res) => {
    const { id } = req.params;
    const bookingId = parseInt(id);

    console.log(`[QR Generate] Memproses untuk Booking ID: ${bookingId}`);

    try {
        const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

        if (!booking || booking.status !== 'Approved') {
            console.log(`[QR Generate] Gagal: Booking ID ${bookingId} tidak ditemukan atau belum disetujui.`);
            return res.status(400).json({ success: false, message: 'Hanya booking yang sudah disetujui yang bisa dibuatkan QR Code.' });
        }

        // 1. Cek apakah token untuk booking ini sudah ada
        const existingQrCode = await prisma.qRCode.findUnique({
            where: { bookingId: bookingId },
        });

        // 2. Jika sudah ada, langsung kembalikan token yang lama
        if (existingQrCode) {
            console.log(`[QR Generate] Token sudah ada untuk Booking ID ${bookingId}. Mengembalikan token yang lama.`);
            return res.json({
                success: true,
                message: 'QR Code sudah ada, mengambil token yang lama.',
                data: { token: existingQrCode.token },
            });
        }

        // 3. Jika belum ada, buat token baru
        console.log(`[QR Generate] Membuat token baru untuk Booking ID ${bookingId}.`);
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(booking.endTime);
        expiresAt.setUTCHours(23, 59, 59, 999);

        const newQrCode = await prisma.qRCode.create({
            data: {
                bookingId: bookingId,
                token,
                expiresAt,
            }
        });

        res.json({ success: true, message: 'QR Code token berhasil dibuat.', data: { token: newQrCode.token } });

    } catch (error) {
         console.error(`[QR Generate] Error untuk Booking ID ${bookingId}:`, error);
         res.status(500).json({ success: false, message: 'Gagal memproses QR Code.', error: error.message });
    }
};