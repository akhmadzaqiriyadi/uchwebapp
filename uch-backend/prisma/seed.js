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

    // Hapus artikel yang dibuat oleh admin
    console.log('Menghapus artikel terkait admin...');
    await prisma.article.deleteMany({
      where: { authorId: { in: adminUserIds } }
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

  // Buat data author untuk testing
  const hashedAuthorPassword = await bcrypt.hash('author123', 10);
  const author = await prisma.user.create({
    data: {
      name: 'Author UCH',
      npm: 'AUTHOR001',
      email: 'author@uty.ac.id',
      prodi: 'Sistem Informasi',
      password: hashedAuthorPassword,
      role: 'AUTHOR',
    },
  });
  console.log(`Author berhasil dibuat: ${author.name} (ID: ${author.id})`);

  // Author user
  const authorUser = await prisma.user.create({
    data: {
      name: "Ayas",
      npm: "AUTHOR001",
      email: "ayas@uty.ac.id", 
      prodi: "Ilmu Komunikasi",
      password: await bcrypt.hash("ayas123@keren", 10), // ganti password sesuai kebutuhan
      role: "AUTHOR"
    }
  });

  console.log("✅ Author user created:", {
    name: authorUser.name,
    email: authorUser.email,
    role: authorUser.role
  });

  // Buat categories default
  console.log('Membuat categories default...');
  const categories = [
    { name: 'Teknologi' },
    { name: 'Kreatif' },
    { name: 'Bisnis' },
    { name: 'Edukasi' },
    { name: 'Event' }
  ];

  for (const categoryData of categories) {
    const existingCategory = await prisma.category.findUnique({
      where: { name: categoryData.name }
    });
    
    if (!existingCategory) {
      await prisma.category.create({ data: categoryData });
      console.log(`Category dibuat: ${categoryData.name}`);
    } else {
      console.log(`Category sudah ada: ${categoryData.name}`);
    }
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

  for (const tagName of tags) {
    const existingTag = await prisma.tag.findUnique({
      where: { name: tagName }
    });
    
    if (!existingTag) {
      await prisma.tag.create({ data: { name: tagName } });
      console.log(`Tag dibuat: ${tagName}`);
    } else {
      console.log(`Tag sudah ada: ${tagName}`);
    }
  }

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