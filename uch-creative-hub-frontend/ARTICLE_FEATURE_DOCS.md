# Dokumentasi Fitur Artikel - UTY Creative Hub Frontend

## Overview
Fitur artikel telah berhasil diimplementasi dengan menggunakan Quill.js sebagai rich text editor. Berikut adalah struktur dan cara penggunaan fitur ini.

## Struktur File

### Services
- `src/_services/article.service.ts` - Service untuk komunikasi dengan API artikel

### Components
- `src/components/articles/QuillEditor.tsx` - Rich text editor menggunakan Quill.js
- `src/components/articles/ArticleForm.tsx` - Form untuk membuat/edit artikel
- `src/components/articles/ArticleList.tsx` - Komponen untuk menampilkan daftar artikel
- `src/components/articles/CategoryManager.tsx` - Manajemen kategori dengan CRUD operations
- `src/components/articles/TagManager.tsx` - Manajemen tag dengan CRUD operations
- `src/components/articles/ArticleStats.tsx` - Dashboard statistik artikel
- `src/components/ui/loading-spinner.tsx` - Loading state component

### Pages
- `src/app/(main)/articles/page.tsx` - Halaman daftar artikel publik
- `src/app/(main)/articles/[slug]/page.tsx` - Halaman detail artikel
- `src/app/(main)/admin/articles/page.tsx` - Halaman admin untuk mengelola artikel
- `src/app/page.tsx` - Homepage (updated dengan section artikel terbaru)

## Fitur yang Diimplementasi

### 1. Rich Text Editor (Quill.js)
- ✅ Toolbar lengkap dengan formatting options
- ✅ Support untuk heading, font, color, alignment
- ✅ Support untuk list, quotes, code blocks
- ✅ Support untuk links, images, videos
- ✅ Responsive design

### 2. Article Management
- ✅ Membuat artikel baru
- ✅ Edit artikel existing
- ✅ Upload gambar utama artikel
- ✅ Pilih multiple kategori
- ✅ Tambah multiple tags (auto-create jika belum ada)
- ✅ Status publish/draft
- ✅ Delete artikel

### 3. Article Display
- ✅ Daftar artikel dengan filter dan search
- ✅ Detail artikel dengan layout responsive
- ✅ Preview di homepage
- ✅ Kategori dan tag display
- ✅ Author dan tanggal

### 4. Admin Interface
- ✅ Dashboard artikel dengan tabs
- ✅ CRUD operations untuk artikel
- ✅ Manajemen kategori dengan dialog interface
- ✅ Manajemen tag dengan dialog interface
- ✅ Statistik artikel real-time
- ✅ Responsive admin panel

### 5. Category & Tag Management
- ✅ Buat, edit, hapus kategori
- ✅ Buat, edit, hapus tag
- ✅ Validation dan error handling
- ✅ Confirmation dialogs untuk delete operations
- ✅ Real-time updates tanpa page refresh

## API Integration

Service sudah dikonfigurasi untuk berkomunikasi dengan API backend:

### Endpoints yang digunakan:
- `GET /articles` - Daftar artikel
- `GET /articles/:slug` - Detail artikel
- `POST /articles` - Buat artikel baru
- `PATCH /articles/:id` - Update artikel
- `DELETE /articles/:id` - Hapus artikel
- `GET /categories` - Daftar kategori
- `POST /categories` - Buat kategori baru
- `PATCH /categories/:id` - Update kategori
- `DELETE /categories/:id` - Hapus kategori
- `GET /tags` - Daftar tag
- `POST /tags` - Buat tag baru
- `PATCH /tags/:id` - Update tag
- `DELETE /tags/:id` - Hapus tag

### Authentication:
- JWT token otomatis ditambahkan ke header request
- Token diambil dari localStorage dengan key "uch-token"

## Cara Menggunakan

### 1. Mengakses Halaman Artikel
```
http://localhost:3001/articles
```

### 2. Mengakses Admin Panel
```
http://localhost:3001/admin/articles
```

### 3. Membuat Artikel Baru
1. Login sebagai Author/Admin
2. Pergi ke `/admin/articles`
3. Klik "Artikel Baru" atau tab "Buat Baru"
4. Isi form dengan:
   - Judul artikel
   - Upload gambar (opsional)
   - Pilih kategori (minimal 1)
   - Tambah tag (opsional)
   - Tulis konten menggunakan Quill editor
   - Centang "Publikasikan artikel" jika ingin langsung publish
5. Klik "Publish" atau "Update"

### 4. Mengedit Artikel
1. Di halaman admin, klik tombol "Edit" pada artikel yang ingin diedit
2. Form akan otomatis terisi dengan data artikel
3. Lakukan perubahan yang diperlukan
4. Klik "Update"

## Styling dan UI

### Design System:
- ✅ Menggunakan Tailwind CSS
- ✅ Color scheme konsisten dengan brand UTY Creative Hub
- ✅ Responsive design untuk mobile dan desktop
- ✅ Motion animations menggunakan Framer Motion
- ✅ shadcn/ui components untuk konsistensi

### Quill Editor Styling:
- ✅ Custom CSS untuk integration dengan design system
- ✅ Border radius dan spacing yang konsisten
- ✅ Focus states dan hover effects
- ✅ Responsive toolbar

## Dependencies yang Ditambahkan

```json
{
  "quill": "^2.0.2"
}
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Testing

Untuk testing fitur artikel:

1. **Start Backend Server:**
   ```bash
   cd uch-backend
   npm start
   ```

2. **Start Frontend Server:**
   ```bash
   cd uch-creative-hub-frontend
   npm run dev
   ```

3. **Test Scenarios:**
   - [ ] Buat artikel baru dengan gambar
   - [ ] Edit artikel existing
   - [ ] Delete artikel
   - [ ] Filter artikel berdasarkan kategori
   - [ ] Search artikel
   - [ ] View detail artikel
   - [ ] Responsive pada mobile

## Next Steps

### Potential Enhancements:
1. **SEO Optimization:**
   - Meta tags untuk artikel
   - Open Graph tags
   - Structured data

2. **Advanced Features:**
   - Artikel serupa/related articles
   - Komentar sistem
   - Social sharing
   - Analytics tracking

3. **Content Management:**
   - Bulk operations
   - Import/export artikel
   - Revision history
   - Auto-save draft

4. **Performance:**
   - Image optimization
   - Lazy loading
   - Caching strategy

## Troubleshooting

### Common Issues:

1. **Quill Editor tidak muncul:**
   - Pastikan CSS Quill sudah di-import
   - Check console untuk error

2. **Upload gambar gagal:**
   - Pastikan backend mendukung multipart/form-data
   - Check file size limits

3. **API connection error:**
   - Pastikan backend server berjalan
   - Check NEXT_PUBLIC_API_URL di .env.local

4. **Authentication error:**
   - Pastikan token tersimpan di localStorage
   - Check token expiration
