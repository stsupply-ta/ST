/* ============================================================================
   ST SUPPLY APPAREL — Central Product Data Source
   ============================================================================
   Satu sumber data produk untuk seluruh situs. Komponen tampilan membaca dari
   objek `PRODUCTS` dan `CATEGORIES` di bawah ini, jadi konten produk tidak
   tersebar di banyak file HTML.

   PERINGATAN PENTING (per Master Project Brief):
   - Rekaman di bawah ini adalah FIXTURE PENGEMBANGAN (development fixtures).
     Tandai dengan jelas dan pastikan tidak disalahkan sebagai stok asli saat
     produksi.
   - JANGAN mengarang harga, stok, ukuran, warna, material, SKU, atau
     ketersediaan yang tidak terverifikasi.
   - Kolom opsional harus dihilangkan (tidak ditampilkan) saat tidak tersedia.
   - Ganti dengan data asli dari pemilik usaha sebelum peluncuran.
   ============================================================================ */

export const CONTACT = {
  // Nomor WhatsApp resmi. Kosongkan = tidak ada WhatsApp CTA yang dihasilkan.
  // Isi dalam format internasional tanpa tanda '+', contoh: "6281234567890".
  phoneNumber: "",
  defaultMessage: "Halo ST SUPPLY APPAREL, saya tertarik memesan produk.",
  enabled: false,
};

export const SOCIAL = {
  linktree: "https://linktr.ee/st_supply",
  instagram: "",
  tiktok: "",
  youtube: "",
  facebook: "",
  shopee: "",
  whatsapp: "",
};

export const STORE = {
  name: "ST SUPPLY APPAREL",
  tagline: "Online - Murah - Maksimal",
  // Alamat hanya ditampilkan setelah diverifikasi. Jangan buat pin peta
  // berdasarkan alamat perkiraan.
  address: "Pakisaji, Tenggur, Kabupaten Tulungagung, Jawa Timur, Indonesia",
  addressVerified: false,
  mapUrl: "",
};

/* ------------------------------------------------------------------ *
   Katalog produk. Setiap item published=true akan muncul di halaman
   publik. Gambar harus disimpan di assets/img/products/ dan mudah
   diganti. Kosongkan `price`, `sizes`, `colors`, `material`, `sku`,
   `marketplaceUrl` saat data belum tersedia.
   *----------------------------------------------------------------- */
export const PRODUCTS = [
  {
    id: "dev-001",
    slug: "kaos-oversize-hitam",
    name: "Kaos Oversize Hitam",
    category: "Kaos",
    description:
      "Kaos oversize bahan katun nyaman untuk gaya harian. Foto di bawah adalah fixture pengembangan — ganti dengan foto produk asli.",
    image: "assets/img/products/placeholder.jpg",
    gallery: [],
    featured: true,
    published: true,
    // Harga, ukuran, warna, dll. sengaja dikosongkan karena belum terverifikasi.
  },
  {
    id: "dev-002",
    slug: "hoodie-cream-minimal",
    name: "Hoodie Cream Minimalis",
    category: "Hoodie",
    description:
      "Hoodie warna cream dengan desain minimalis. Foto di bawah adalah fixture pengembangan — ganti dengan foto produk asli.",
    image: "assets/img/products/placeholder.jpg",
    gallery: [],
    featured: true,
    published: true,
  },
  {
    id: "dev-003",
    slug: "celana-chino-navy",
    name: "Celana Chino Navy",
    category: "Celana",
    description:
      "Celana chino model slim fit warna navy. Foto di bawah adalah fixture pengembangan — ganti dengan foto produk asli.",
    image: "assets/img/products/placeholder.jpg",
    gallery: [],
    featured: false,
    published: true,
  },
  {
    id: "dev-004",
    slug: "jakerta-bomber-abat",
    name: "Jaket Bomber Abu-abu",
    category: "Jaket",
    description:
      "Jaket bomber bahan tebal untuk suasana dingin. Foto di bawah adalah fixture pengembangan — ganti dengan foto produk asli.",
    image: "assets/img/products/placeholder.jpg",
    gallery: [],
    featured: false,
    published: true,
  },
  {
    id: "dev-005",
    slug: "kemeja-flanel-merah",
    name: "Kemeja Flanel Merah",
    category: "Kemeja",
    description:
      "Kemeja flanel model kotak-kotak warna merah. Foto di bawah adalah fixture pengembangan — ganti dengan foto produk asli.",
    image: "assets/img/products/placeholder.jpg",
    gallery: [],
    featured: false,
    published: true,
  },
  {
    id: "dev-006",
    slug: "shorts-denim-hitam",
    name: "Shorts Denim Hitam",
    category: "Shorts",
    description:
      "Shorts denim hitam potongan lurus. Foto di bawah adalah fixture pengembangan — ganti dengan foto produk asli.",
    image: "assets/img/products/placeholder.jpg",
    gallery: [],
    featured: false,
    published: true,
  },
];

export function getPublishedProducts() {
  return PRODUCTS.filter((p) => p.published);
}

export function getFeaturedProducts() {
  return PRODUCTS.filter((p) => p.published && p.featured);
}

export function getProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

export function getCategories() {
  const cats = [...new Set(PRODUCTS.filter((p) => p.published).map((p) => p.category))];
  return cats;
}

export function filterProductsByCategory(category) {
  if (!category || category === "Semua") {
    return getPublishedProducts();
  }
  return getPublishedProducts().filter((p) => p.category === category);
}
