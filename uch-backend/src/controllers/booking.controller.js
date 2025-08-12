// src/controllers/booking.controller.js
const prisma = require("../db");
const { sendBookingNotification } = require("../services/email.service");

exports.createBooking = async (req, res) => {
  // Ambil userId dari token yang sudah di-decode oleh middleware 'protect'
  const userId = req.user.userId;
  const { room, purpose, audience, date, startTime, endTime } = req.body;

  try {
    // Konversi waktu dari WIB ke UTC dengan benar
    // Input: startTime="16:00", endTime="19:00" (WIB)
    // Output: Simpan sebagai UTC dengan offset -7 jam
    const startDateTime = new Date(`${date}T${startTime}:00+07:00`);
    const endDateTime = new Date(`${date}T${endTime}:00+07:00`);

    const booking = await prisma.booking.create({
      data: {
        userId, // Langsung gunakan ID dari user yang login
        room,
        purpose,
        audience: parseInt(audience),
        bookingDate: new Date(date),
        startTime: startDateTime,
        endTime: endDateTime,
        status: "Pending",
      },
      include: {
        user: true, // Sertakan data user dalam respons
      },
    });

    // Kirim notifikasi email ke admin
    await sendBookingNotification(
      process.env.ADMIN_EMAIL,
      "Booking Ruangan Baru",
      `Ada booking baru dari ${booking.user.name} (${booking.user.npm}) untuk ruangan ${room} pada tanggal ${date}. Mohon untuk ditinjau.`
    );

    res
      .status(201)
      .json({
        success: true,
        message: "Booking berhasil diajukan!",
        data: booking,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Gagal membuat booking.",
        error: error.message,
      });
  }
};

exports.getSchedule = async (req, res) => {
  const { date } = req.query; // Ambil tanggal dari query URL, contoh: /api/bookings/schedule?date=2025-12-31

  if (!date) {
    return res
      .status(400)
      .json({ success: false, message: "Parameter tanggal diperlukan." });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        bookingDate: new Date(date),
        status: { in: ["Approved", "Checked-in"] }, 
      },
      select: {
        room: true,
        startTime: true,
        endTime: true,
        user: {
          select: { name: true },
        },
      },
    });

    res.json({ success: true, data: bookings });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Gagal mengambil jadwal.",
        error: error.message,
      });
  }
};

exports.getAvailableSlots = async (req, res) => {
  const { date, room } = req.query;

  if (!date || !room) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Parameter tanggal dan ruangan diperlukan.",
      });
  }

  try {
    const dayOfWeek = new Date(date).getDay(); // 0=Minggu, 1=Senin, ..., 6=Sabtu

    const operatingHours = {
      // Minggu & Sabtu tutup
      1: { start: 9, end: 16 }, // Senin
      2: { start: 9, end: 16 }, // Selasa
      3: { start: 9, end: 16 }, // Rabu
      4: { start: 9, end: 16 }, // Kamis
      5: { start: 9, end: 16 }, // Jumat
      6: { start: 9, end: 12 }, // Sabtu
    };

    const hours = operatingHours[dayOfWeek];
    if (!hours) {
      return res.json({
        success: true,
        availableIntervals: [],
        message: "Hari libur.",
      });
    }

    const bookedTimes = await prisma.booking.findMany({
      where: {
        bookingDate: new Date(date),
        room: room,
        status: { in: ["Pending", "Approved", "Checked-in"] },
      },
      select: { startTime: true, endTime: true },
    });

    const bookedRanges = bookedTimes.map((b) => ({
      start: b.startTime.getHours(), // Ganti dari getUTCHours() menjadi getHours()
      end: b.endTime.getHours(),   // Ganti dari getUTCHours() menjadi getHours()
    }));

    // Logika untuk menghitung interval yang tersedia
    let currentStart = hours.start;
    const availableIntervals = [];

    bookedRanges
      .sort((a, b) => a.start - b.start)
      .forEach((booking) => {
        if (booking.start > currentStart) {
          availableIntervals.push({ start: currentStart, end: booking.start });
        }
        currentStart = Math.max(currentStart, booking.end);
      });

    if (currentStart < hours.end) {
      availableIntervals.push({ start: currentStart, end: hours.end });
    }

    res.json({
      success: true,
      data: { operatingHours: hours, bookedRanges, availableIntervals },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Gagal mengambil slot.",
        error: error.message,
      });
  }
};

exports.getMyBookingHistory = async (req, res) => {
  const userId = req.user.userId;

  try {
    const userBookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        bookingDate: "desc", // Tampilkan dari yang paling baru
      },
      // Anda bisa memilih data apa saja yang ingin ditampilkan
      select: {
        id: true,
        room: true,
        bookingDate: true,
        startTime: true,
        endTime: true,
        status: true,
      },
    });

    res.json({ success: true, data: userBookings });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Gagal mengambil riwayat booking.",
        error: error.message,
      });
  }
};
