// Mock data untuk testing dan development
import { Article, Category, Tag } from './article.service';

export const simulateDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

export const mockCategories: Category[] = [
  { id: 1, name: 'Teknologi' },
  { id: 2, name: 'Pendidikan' },
  { id: 3, name: 'Inovasi' },
  { id: 4, name: 'Startup' },
  { id: 5, name: 'Digital' },
];

export const mockTags: Tag[] = [
  { id: 1, name: 'Web Development' },
  { id: 2, name: 'Mobile App' },
  { id: 3, name: 'AI' },
  { id: 4, name: 'Machine Learning' },
  { id: 5, name: 'UI/UX' },
  { id: 6, name: 'Database' },
  { id: 7, name: 'Cloud Computing' },
  { id: 8, name: 'Blockchain' },
];

export const mockArticles: Article[] = [
  {
    id: 1,
    title: 'Pengantar Web Development Modern',
    slug: 'pengantar-web-development-modern',
    content: `
      <h2>Apa itu Web Development Modern?</h2>
      <p>Web development modern mengacu pada praktik terkini dalam pembuatan aplikasi web yang menggunakan teknologi dan framework terbaru untuk menciptakan pengalaman pengguna yang lebih baik.</p>
      
      <h3>Teknologi yang Digunakan</h3>
      <ul>
        <li>React.js atau Vue.js untuk frontend</li>
        <li>Node.js untuk backend</li>
        <li>TypeScript untuk type safety</li>
        <li>Next.js untuk full-stack development</li>
      </ul>
      
      <p>Dalam artikel ini, kita akan membahas berbagai aspek dari web development modern dan bagaimana Anda bisa memulainya.</p>
    `,
    imageUrl: '/placeholder.jpg',
    published: true,
    authorId: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    author: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    categories: [mockCategories[0]], // Teknologi
    tags: [mockTags[0], mockTags[4]] // Web Development, UI/UX
  },
  {
    id: 2,
    title: 'Masa Depan Artificial Intelligence',
    slug: 'masa-depan-artificial-intelligence',
    content: `
      <h2>AI: Teknologi Masa Depan</h2>
      <p>Artificial Intelligence (AI) telah menjadi salah satu teknologi paling revolusioner di abad ke-21. Dari asisten virtual hingga mobil otonom, AI mengubah cara kita hidup dan bekerja.</p>
      
      <h3>Aplikasi AI Saat Ini</h3>
      <ol>
        <li>Natural Language Processing</li>
        <li>Computer Vision</li>
        <li>Machine Learning</li>
        <li>Deep Learning</li>
      </ol>
      
      <blockquote>
        "AI bukan hanya tentang menggantikan manusia, tetapi tentang membantu manusia menjadi lebih produktif."
      </blockquote>
    `,
    imageUrl: '/placeholder.jpg',
    published: true,
    authorId: 2,
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z',
    author: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    },
    categories: [mockCategories[0], mockCategories[2]], // Teknologi, Inovasi
    tags: [mockTags[2], mockTags[3]] // AI, Machine Learning
  },
  {
    id: 3,
    title: 'Membangun Startup Teknologi yang Sukses',
    slug: 'membangun-startup-teknologi-yang-sukses',
    content: `
      <h2>Langkah-langkah Membangun Startup</h2>
      <p>Membangun startup teknologi memerlukan perencanaan yang matang dan eksekusi yang tepat. Berikut adalah panduan lengkap untuk memulai startup Anda.</p>
      
      <h3>Fase Pre-launch</h3>
      <ul>
        <li>Riset pasar dan validasi ide</li>
        <li>Pembentukan tim inti</li>
        <li>Pengembangan MVP (Minimum Viable Product)</li>
        <li>Pencarian funding awal</li>
      </ul>
      
      <h3>Fase Launch</h3>
      <p>Setelah persiapan matang, saatnya meluncurkan produk ke pasar. Pastikan Anda memiliki strategi marketing yang solid.</p>
    `,
    imageUrl: '/placeholder.jpg',
    published: true,
    authorId: 1,
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    author: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    categories: [mockCategories[3], mockCategories[2]], // Startup, Inovasi
    tags: [mockTags[0], mockTags[1]] // Web Development, Mobile App
  },
  // Artikel belum dipublikasikan (draft)
  {
    id: 4,
    title: 'Panduan Lengkap Cloud Computing untuk Pemula',
    slug: 'panduan-lengkap-cloud-computing-untuk-pemula',
    content: `
      <h2>Mengenal Cloud Computing</h2>
      <p>Cloud computing adalah model penyediaan layanan teknologi informasi yang memungkinkan akses ke sumber daya komputasi melalui internet.</p>
      
      <h3>Jenis-jenis Cloud Service</h3>
      <ul>
        <li>Software as a Service (SaaS)</li>
        <li>Platform as a Service (PaaS)</li>
        <li>Infrastructure as a Service (IaaS)</li>
      </ul>
      
      <p>Artikel ini masih dalam tahap draft dan akan dipublikasikan setelah review lebih lanjut.</p>
    `,
    imageUrl: '/placeholder.jpg',
    published: false, // DRAFT
    authorId: 1,
    createdAt: '2024-01-12T16:00:00Z',
    updatedAt: '2024-01-12T16:00:00Z',
    author: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    categories: [mockCategories[0]], // Teknologi
    tags: [mockTags[6]] // Cloud Computing
  },
  {
    id: 5,
    title: 'Blockchain dan Cryptocurrency: Revolusi Digital',
    slug: 'blockchain-dan-cryptocurrency-revolusi-digital',
    content: `
      <h2>Teknologi Blockchain</h2>
      <p>Blockchain adalah teknologi distributed ledger yang menjadi dasar dari cryptocurrency dan banyak aplikasi desentralisasi lainnya.</p>
      
      <h3>Keunggulan Blockchain</h3>
      <ol>
        <li>Transparansi</li>
        <li>Keamanan tinggi</li>
        <li>Desentralisasi</li>
        <li>Immutability</li>
      </ol>
      
      <p>Artikel ini sedang dalam tahap review dan belum siap untuk dipublikasikan.</p>
    `,
    imageUrl: '/placeholder.jpg',
    published: false, // DRAFT
    authorId: 2,
    createdAt: '2024-01-11T13:30:00Z',
    updatedAt: '2024-01-11T13:30:00Z',
    author: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    },
    categories: [mockCategories[0], mockCategories[2]], // Teknologi, Inovasi
    tags: [mockTags[7]] // Blockchain
  }
];
