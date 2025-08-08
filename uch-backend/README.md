# UCH Backend - Sistem Booking Ruangan Creative Hub

## 📖 Deskripsi

UCH Backend adalah aplikasi backend untuk sistem manajemen booking ruangan di Creative Hub. Aplikasi ini menyediakan API untuk registrasi pengguna, autentikasi, pemesanan ruangan, persetujuan admin, dan sistem check-in menggunakan QR Code.

## 🚀 Fitur Utama

- **Sistem Autentikasi**: Registrasi dan login pengguna dengan JWT
- **Manajemen Role**: Admin dan User dengan hak akses berbeda
- **Booking Ruangan**: Pemesanan ruangan dengan validasi jadwal
- **Sistem Persetujuan**: Admin dapat menyetujui atau menolak booking
- **QR Code Check-in**: Sistem check-in menggunakan token QR code
- **Notifikasi Email**: Pemberitahuan status booking via email
- **Validasi Jadwal**: Pengecekan ketersediaan ruangan dan slot waktu

## 🛠️ Teknologi yang Digunakan

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL dengan Prisma ORM
- **Autentikasi**: JSON Web Token (JWT)
- **Password Hashing**: bcryptjs
- **Email Service**: Nodemailer
- **Development Tools**: Nodemon

## 📁 Struktur Proyek

```
uch-backend/
├── prisma/
│   ├── schema.prisma           # Skema database
│   ├── seed.js                 # Data seeding
│   └── migrations/             # File migrasi database
├── src/
│   ├── controllers/            # Controller untuk logika bisnis
│   │   ├── auth.controller.js
│   │   ├── booking.controller.js
│   │   ├── admin.controller.js
│   │   └── checkin.controller.js
│   ├── middleware/             # Middleware untuk autentikasi
│   │   └── auth.middleware.js
│   ├── routes/                 # Definisi rute API
│   │   ├── auth.routes.js
│   │   ├── booking.routes.js
│   │   ├── admin.routes.js
│   │   └── checkin.routes.js
│   ├── services/               # Service layer
│   │   └── email.service.js
│   ├── db.js                   # Konfigurasi database
│   └── index.js                # Entry point aplikasi
├── package.json                # Dependencies dan scripts
└── .env                        # Environment variables
```

## 🗄️ Model Database

### User
- **id**: Primary key
- **name**: Nama lengkap pengguna
- **npm**: Nomor Pokok Mahasiswa (unique)
- **email**: Email pengguna (unique)
- **prodi**: Program studi
- **password**: Password terenkripsi
- **role**: Role pengguna (USER/ADMIN)

### Booking
- **id**: Primary key
- **userId**: Foreign key ke User
- **room**: Nama ruangan
- **purpose**: Tujuan penggunaan
- **audience**: Jumlah peserta
- **bookingDate**: Tanggal booking
- **startTime**: Waktu mulai
- **endTime**: Waktu selesai
- **status**: Status booking (Pending/Approved/Rejected/Checked-in)

### QRCode
- **id**: Primary key
- **bookingId**: Foreign key ke Booking
- **token**: Token unik untuk QR code
- **expiresAt**: Waktu kedaluwarsa

### Checkin
- **id**: Primary key
- **bookingId**: Foreign key ke Booking
- **userId**: Foreign key ke User
- **checkinTime**: Waktu check-in

## 🔧 Instalasi dan Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd uch-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat file `.env` di root directory:
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
JWT_SECRET="your-secret-key-here"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
ADMIN_EMAIL="admin@example.com"
```

### 4. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database dengan admin user
npx prisma db seed
```

### 5. Jalankan Aplikasi

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Registrasi pengguna baru
```json
{
  "name": "John Doe",
  "npm": "12345678",
  "email": "john@example.com",
  "prodi": "Teknik Informatika",
  "password": "password123"
}
```

#### POST `/api/auth/login`
Login pengguna
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Booking Endpoints

#### POST `/api/bookings`
Membuat booking baru (Protected)
```json
{
  "room": "Meeting Room A",
  "purpose": "Rapat tim",
  "audience": 10,
  "date": "2025-08-15",
  "startTime": "09:00",
  "endTime": "11:00"
}
```

#### GET `/api/bookings/schedule?date=2025-08-15`
Mendapatkan jadwal booking pada tanggal tertentu

#### GET `/api/bookings/available-slots?date=2025-08-15&room=Meeting Room A`
Mendapatkan slot waktu yang tersedia

#### GET `/api/bookings/my-history`
Mendapatkan riwayat booking pengguna (Protected)

### Admin Endpoints (Protected & Admin Only)

#### GET `/api/admin/bookings`
Mendapatkan semua booking

#### PATCH `/api/admin/bookings/:id/status`
Mengubah status booking
```json
{
  "status": "Approved" // atau "Rejected"
}
```

#### POST `/api/admin/bookings/:id/generate-qr`
Generate token QR code untuk booking yang disetujui

### Check-in Endpoint

#### POST `/api/checkin`
Proses check-in dengan QR code token (Protected)
```json
{
  "token": "qr-code-token-here"
}
```

## 🔐 Sistem Autentikasi

### JWT Token
- Token disertakan dalam header: `Authorization: Bearer <token>`
- Token berisi informasi: `userId` dan `role`
- Masa berlaku: 1 hari

### Middleware
- **protect**: Memverifikasi token JWT
- **isAdmin**: Memastikan pengguna memiliki role ADMIN

## 📧 Sistem Email

Aplikasi menggunakan Nodemailer untuk mengirim notifikasi email:
- **Booking baru**: Notifikasi ke admin
- **Status update**: Notifikasi ke pengguna

## ⏰ Jadwal Operasional

- **Hari kerja**: Senin - Jumat (09:00 - 16:00)
- **Hari libur**: Sabtu - Minggu (tutup)

## 🔄 Status Booking

1. **Pending**: Booking baru menunggu persetujuan
2. **Approved**: Booking disetujui admin
3. **Rejected**: Booking ditolak admin
4. **Checked-in**: User sudah melakukan check-in

## 🛡️ Keamanan

- Password dienkripsi menggunakan bcrypt
- JWT untuk autentikasi
- Validasi input pada setiap endpoint
- Middleware untuk proteksi rute
- QR code token dengan masa berlaku

## 🧪 Testing

Untuk testing API, Anda dapat menggunakan:
- Postman
- Insomnia
- cURL
- Thunder Client (VS Code extension)

## 📝 Seeding Data

Aplikasi menyediakan seeding untuk membuat admin user:
- **Email**: admin@uty.ac.id
- **Password**: admin123
- **NPM**: ADMIN001
- **Role**: ADMIN

## 🤝 Kontribusi

1. Fork repository
2. Buat branch fitur baru
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📄 Lisensi

ISC License

## 📞 Kontak

Untuk pertanyaan atau dukungan, silakan hubungi tim pengembang.

---

*Dibuat dengan ❤️ untuk UCH Creative Hub*
