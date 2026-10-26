# ST SUPPLY APPAREL — Website

Website resmi **ST SUPPLY APPAREL** — bisnis kombinasi produksi dan penjualan apparel dengan tagline resmi **"Online - Murah - Maksimal"**.

Situs ini dibangun sebagai company profile, katalog produk, dan pengarah pembelian, sesuai **Master Project Brief** di `ST_SUPPLY_APPAREL_Master_Project_Brief_Cline.md`.

## Tech Stack

- Static HTML + vanilla CSS + vanilla JavaScript ES module (no framework, no build step, no dependencies)
- Google Fonts: Inter (400 / 500 / 600 / 700)
- CSS Custom Properties sebagai design token di `assets/css/styles.css`
- Produk data terpusat di `assets/js/products.js`

## Halaman

- `index.html` — Home (hero, produk unggulan, kategori, pengenalan brand, layanan, kanal pembelian, kontak, footer)
- `catalog.html` — Catalog (grid produk, filter kategori, detail produk)
- `product.html` — Product Detail (gambar, nama, deskripsi, kategori, ukuran, warna, material, harga, SKU, marketplace, WhatsApp) — diisi via query param `?slug=`
- `services.html` — Production & Services (hanya menampilkan layanan yang dikonfirmasi)
- `about.html` — About Us (profil bisnis, visi, misi, nilai brand)
- `contact.html` — Contact (WhatsApp, marketplace, media sosial, Linktree, lokasi)
- `404.html` — Halaman tidak ditemukan

## Design System

- Palet: hitam `#0B0B0B`, charcoal `#222222`, off-white `#F5F5F2`, abu-abu `#A3A3A3`, putih `#FFFFFF`
- Aksen: **merah** `#DC2626` (menggantikan warna kuning stabilo / lime green)
- Typography: sans-serif modern (Inter), hierarki jelas

## Menjalankan Lokal

```bash
# Salin atau gunakan langsung via static server
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

## Konfigurasi Penting

### Produk (`assets/js/products.js`)

- Ganti fixture pengembangan dengan data produk asli sebelum peluncuran.
- Jangan menampilkan harga, ukuran, warna, material, SKU, atau stok yang belum tersedia.

### WhatsApp (`assets/js/products.js`)

- Isi `CONTACT.phoneNumber` (format internasional tanpa tanda `+`).
- Set `CONTACT.enabled = true` untuk menampilkan CTA WhatsApp.
- CTA WhatsApp hanya dibangun dari nomor yang valid.

### Media Sosial & Marketplace

- Isi `SOCIAL` dan `STORE` di `assets/js/products.js` untuk kanal yang terverifikasi.
- Sembunyikan kanal yang belum valid.

### Lokasi

- Set `STORE.addressVerified` ke `true` setelah alamat toko diverifikasi.

## Checklist Sebelum Publikasi

- [ ] Logo resmi sudah dipasang.
- [ ] Foto produk asli sudah dipasang.
- [ ] Nomor WhatsApp resmi sudah dimasukkan dan diuji.
- [ ] URL marketplace dan media sosial sudah diverifikasi.
- [ ] Harga dan detail produk sudah diperiksa.
- [ ] Layanan produksi yang ditampilkan sudah dikonfirmasi.
- [ ] Alamat dan tautan peta sudah diverifikasi.
- [ ] Build produksi berhasil.
- [ ] Tampilan mobile dan desktop sudah diuji.

## Detail Teknis

- Semua halaman HTML statis, link internal menggunakan relatif.
- `site.js` dijalankan sebagai ES module (`type="module"`).
- `products.js` diekspor sebagai data terpusat.
- Motion dihormati `prefers-reduced-motion`.
- Semua elemen interaktif memiliki state keyboard dan aria.

## Catatan

- Foto produk asli harus diganti sebelum peluncuran; saat ini masih menggunakan fixture pengembangan.
- Data seperti tanggal, jumlah tim, kapasitas, atau klaim tidak boleh dianggap nyata tanpa verifikasi pemilik.
