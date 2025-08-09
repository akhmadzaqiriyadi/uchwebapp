// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Memulai proses seeding...');

  // Cari admin users yang akan dihapus
  const adminUsers = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true }
  });

  if (adminUsers.length > 0) {
    const adminUserIds = adminUsers.map(user => user.id);
    
    // Hapus data terkait dalam urutan yang benar untuk menghindari foreign key constraint
    console.log('Menghapus data checkin terkait admin...');
    await prisma.checkin.deleteMany({
      where: { userId: { in: adminUserIds } }
    });

    console.log('Menghapus data QR codes terkait booking admin...');
    await prisma.qRCode.deleteMany({
      where: {
        booking: {
          userId: { in: adminUserIds }
        }
      }
    });

    console.log('Menghapus data booking admin...');
    await prisma.booking.deleteMany({
      where: { userId: { in: adminUserIds } }
    });

    // Sekarang baru hapus data admin
    await prisma.user.deleteMany({
      where: { role: 'ADMIN' },
    });
    console.log('Data admin lama berhasil dihapus.');
  } else {
    console.log('Tidak ada data admin lama yang perlu dihapus.');
  }

  // Buat data admin baru
  const hashedPassword = await bcrypt.hash('admin123', 10); // Ganti dengan password yang kuat
  const admin = await prisma.user.create({
    data: {
      name: 'Admin UCH',
      npm: 'ADMIN001',
      email: 'admin@uty.ac.id', // Ganti dengan email admin
      prodi: 'Manajemen',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log(`Admin berhasil dibuat: ${admin.name} (ID: ${admin.id})`);

  console.log('Seeding selesai.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });