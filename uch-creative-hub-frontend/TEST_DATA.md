# Test Data untuk Artikel Feature

## Kategori Dummy
Untuk testing fitur kategori, Anda bisa menambahkan kategori berikut melalui interface admin:

1. **Teknologi** - Artikel tentang teknologi dan inovasi
2. **Kreativitas** - Artikel tentang seni dan kreativitas
3. **Bisnis** - Artikel tentang kewirausahaan dan bisnis
4. **Pendidikan** - Artikel edukatif dan pembelajaran
5. **Event** - Artikel tentang acara dan kegiatan
6. **Tutorial** - Panduan dan tutorial praktis

## Tag Dummy
Contoh tag yang bisa ditambahkan:

### Teknologi
- javascript
- react
- nodejs
- ai
- machine-learning
- web-development
- mobile-app

### Kreativitas
- design
- ui-ux
- graphic-design
- digital-art
- photography
- video-editing

### Bisnis
- startup
- entrepreneurship
- marketing
- digital-marketing
- business-strategy
- funding

### Pendidikan
- tutorial
- tips
- guide
- learning
- skill-development
- career

### Event
- workshop
- seminar
- competition
- networking
- collaboration

## Contoh Artikel Dummy

### Artikel 1: "Membangun Aplikasi Web Modern dengan React dan Next.js"
- **Kategori**: Teknologi, Tutorial
- **Tag**: react, nextjs, javascript, web-development, tutorial
- **Status**: Published

### Artikel 2: "Panduan Lengkap UI/UX Design untuk Pemula"
- **Kategori**: Kreativitas, Pendidikan
- **Tag**: ui-ux, design, tutorial, guide, beginner
- **Status**: Published

### Artikel 3: "Strategi Digital Marketing untuk Startup"
- **Kategori**: Bisnis, Marketing
- **Tag**: digital-marketing, startup, business-strategy, marketing
- **Status**: Draft

### Artikel 4: "Tips Networking Efektif di Event Teknologi"
- **Kategori**: Event, Bisnis
- **Tag**: networking, event, career, tips, professional
- **Status**: Published

## API Testing

Untuk test API tanpa backend yang real, Anda bisa:

1. **Mock API Response**: Update service untuk return data dummy
2. **Backend Setup**: Pastikan backend berjalan di `http://localhost:8000`
3. **CORS**: Pastikan CORS dikonfigurasi untuk allow frontend

## Database Seeding

Jika menggunakan backend yang real, tambahkan seeder untuk:

```sql
-- Categories
INSERT INTO Category (name) VALUES 
('Teknologi'),
('Kreativitas'), 
('Bisnis'),
('Pendidikan'),
('Event'),
('Tutorial');

-- Tags  
INSERT INTO Tag (name) VALUES
('javascript'),
('react'),
('nodejs'),
('ui-ux'),
('design'),
('startup'),
('tutorial'),
('tips'),
('workshop'),
('networking');
```

## Testing Checklist

- [ ] Buat kategori baru via admin
- [ ] Edit kategori existing
- [ ] Hapus kategori
- [ ] Buat tag baru via admin
- [ ] Edit tag existing  
- [ ] Hapus tag
- [ ] Buat artikel dengan kategori dan tag
- [ ] Filter artikel berdasarkan kategori
- [ ] Search artikel
- [ ] Lihat statistik artikel
- [ ] Test responsive di mobile
