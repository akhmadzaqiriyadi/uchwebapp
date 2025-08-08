// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Memulai proses seeding...');

  // Hapus data admin lama jika ada untuk menghindari duplikat
  await prisma.user.deleteMany({
    where: { role: 'ADMIN' },
  });
  console.log('Data admin lama berhasil dihapus.');

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