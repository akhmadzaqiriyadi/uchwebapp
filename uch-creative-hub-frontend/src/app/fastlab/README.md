# FastLab Layout Implementation

## Struktur Layout yang Terisolasi

### 1. Layout Khusus FastLab (`/fastlab/layout.tsx`)
- Menggunakan wrapper `<div>` dengan class `fastlab-container`
- Tidak menggunakan `<html>` dan `<body>` untuk menghindari konflik dengan Next.js
- Mengimpor CSS khusus FastLab (`fastlab.css`)
- Font GeistSans dan GeistMono dengan CSS variables (inline style)
- Compatible dengan Server Components (tidak menggunakan styled-jsx)

### 2. CSS Terisolasi (`/fastlab/fastlab.css`)
- Semua selector di-scope dengan class `.fastlab-container`
- Custom scrollbar hanya berlaku untuk FastLab
- Blueprint grid dan styling khusus FastLab
- Font styling terpisah dengan GeistMono dan GeistSans
- CSS variables untuk font families

### 3. Keuntungan Implementasi Ini:
- ✅ FastLab memiliki layout dan styling terpisah
- ✅ Tidak mempengaruhi styling UCH parent
- ✅ Tidak ada hydration error atau HTML nesting issues
- ✅ Tidak ada client-side error (compatible dengan Server Components)
- ✅ Dapat dikustomisasi independen
- ✅ Font dan tema terpisah
- ✅ Scrollbar styling terpisah
- ✅ Compatible dengan Next.js App Router

### 4. Cara Kerja:
1. Ketika user mengakses `/fastlab/*`, Next.js akan menggunakan `layout.tsx` khusus FastLab
2. Layout FastLab akan wrap content dengan `fastlab-container` class
3. CSS FastLab hanya akan bekerja dalam scope `.fastlab-container`
4. Font variables dan styling diterapkan menggunakan inline style (Server-side safe)
5. Halaman lain UCH tidak terpengaruhi karena menggunakan layout dan CSS yang berbeda

### 5. File Structure:
```
src/app/
├── layout.tsx              # Layout utama UCH (Root Layout)
├── globals.css             # CSS global UCH
└── fastlab/
    ├── layout.tsx          # Layout khusus FastLab (Nested Layout)
    ├── fastlab.css         # CSS khusus FastLab (scoped)
    └── page.tsx           # Halaman FastLab
```

### 6. Next.js Layout Hierarchy:
```
RootLayout (layout.tsx)
└── FastLabLayout (fastlab/layout.tsx)
    └── FastLab Page Content
```

## Technical Implementation

### Font Variables Setup:
- GeistSans dan GeistMono di-load di layout FastLab
- CSS variables `--font-sans` dan `--font-mono` di-set via inline style
- Font family diterapkan melalui CSS class dan CSS variables

### Styling Architecture:
- **Scoping**: Semua style menggunakan `.fastlab-container` prefix
- **Isolation**: Tidak ada global style yang mempengaruhi parent
- **Server-safe**: Menggunakan inline style dan CSS classes, bukan styled-jsx

## Customization

Untuk menambahkan styling khusus FastLab:
1. Edit file `fastlab.css`
2. Gunakan prefix `.fastlab-container` untuk scoping
3. Test untuk memastikan tidak mempengaruhi halaman UCH lainnya

## Troubleshooting

- **Hydration Error**: ✅ Fixed dengan menggunakan wrapper `<div>` instead of `<html>`/`<body>`
- **Client-only Error**: ✅ Fixed dengan menggunakan inline style instead of styled-jsx
- **Font Issues**: ✅ Menggunakan CSS variables dan inline style untuk font scoping
- **Style Conflicts**: ✅ Semua styling di-scope dengan `.fastlab-container`

## Error Solutions Applied:

### 1. "Invalid import 'client-only'" Error:
**Problem**: Using `styled-jsx` in Server Component
**Solution**: Replaced `styled-jsx` with inline styles and CSS classes

### 2. "HTML cannot be child of body" Error:
**Problem**: Nested `<html>` and `<body>` tags in layout
**Solution**: Use wrapper `<div>` container instead

### 3. Font Loading Issues:
**Problem**: Font variables not properly scoped
**Solution**: Apply font variables via inline style and CSS classes
