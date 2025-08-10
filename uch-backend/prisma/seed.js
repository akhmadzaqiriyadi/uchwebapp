// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Memulai proses seeding...');

  try {
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
      const bookingsToDelete = await prisma.booking.findMany({
        where: { userId: { in: adminUserIds } },
        select: { id: true }
      });
      
      if (bookingsToDelete.length > 0) {
        const bookingIds = bookingsToDelete.map(b => b.id);
        await prisma.qRCode.deleteMany({
          where: { bookingId: { in: bookingIds } }
        });
      }

      console.log('Menghapus data booking admin...');
      await prisma.booking.deleteMany({
        where: { userId: { in: adminUserIds } }
      });

      // Hapus artikel yang dibuat oleh admin
      console.log('Menghapus artikel terkait admin...');
      if (await prisma.article) {
        await prisma.article.deleteMany({
          where: { authorId: { in: adminUserIds } }
        });
      }

      // Sekarang baru hapus data admin
      await prisma.user.deleteMany({
        where: { role: 'ADMIN' },
      });
      console.log('Data admin lama berhasil dihapus.');
    } else {
      console.log('Tidak ada data admin lama yang perlu dihapus.');
    }
  } catch (error) {
    console.log('Error saat cleanup data lama:', error.message);
    console.log('Melanjutkan dengan seeding data baru...');
  }

  // Buat data admin baru
  console.log('Membuat admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  try {
    const admin = await prisma.user.upsert({
      where: { email: 'admin@uty.ac.id' },
      update: {},
      create: {
        name: 'Admin UCH',
        npm: 'ADMIN001',
        email: 'admin@uty.ac.id',
        prodi: 'Manajemen',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log(`✅ Admin berhasil dibuat: ${admin.name} (${admin.email})`);
  } catch (error) {
    console.log('⚠️ Admin sudah ada atau error:', error.message);
  }

  // Buat data author Ayas
  console.log('Membuat author user...');
  const hashedAuthorPassword = await bcrypt.hash('ayas123@keren', 10);
  
  try {
    const authorUser = await prisma.user.upsert({
      where: { email: 'ayas@uty.ac.id' },
      update: {},
      create: {
        name: "Ayas",
        npm: "AUTHOR002", // Changed to avoid duplicate
        email: "ayas@uty.ac.id", 
        prodi: "Ilmu Komunikasi",
        password: hashedAuthorPassword,
        role: "AUTHOR"
      }
    });

    console.log("✅ Author user created:", {
      name: authorUser.name,
      email: authorUser.email,
      role: authorUser.role
    });
  } catch (error) {
    console.log('⚠️ Author sudah ada atau error:', error.message);
  }

  // Buat categories default
  console.log('Membuat categories default...');
  const categories = [
    { name: 'Teknologi' },
    { name: 'Kreatif' },
    { name: 'Bisnis' },
    { name: 'Edukasi' },
    { name: 'Event' }
  ];

  try {
    for (const categoryData of categories) {
      await prisma.category.upsert({
        where: { name: categoryData.name },
        update: {},
        create: categoryData
      });
      console.log(`✅ Category: ${categoryData.name}`);
    }
  } catch (error) {
    console.log('⚠️ Error creating categories:', error.message);
  }

  // Buat tags default
  console.log('Membuat tags default...');
  const tags = [
    'teknologi', 'inovasi', 'startup', 'digital', 'ai', 'web development',
    'design', 'art', 'kreatif', 'fotografi', 'video', 'musik',
    'bisnis', 'marketing', 'branding', 'entrepreneurship',
    'edukasi', 'tutorial', 'tips', 'learning',
    'event', 'workshop', 'seminar', 'kompetisi'
  ];

  try {
    for (const tagName of tags) {
      await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName }
      });
    }
    console.log(`✅ ${tags.length} tags berhasil dibuat`);
  } catch (error) {
    console.log('⚠️ Error creating tags:', error.message);
  }

  console.log('🎉 Seeding selesai.');
}



main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });