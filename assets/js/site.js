/* ============================================================================
   ST SUPPLY APPAREL — Site JavaScript (ES module)
   Fungsi: navigasi drawer, render katalog produk dari data terpusat,
   detail produk, integrasi WhatsApp, dan motion yang hemat.
   ============================================================================ */

import {
  PRODUCTS,
  getPublishedProducts,
  getFeaturedProducts,
  getProductBySlug,
  getCategories,
  filterProductsByCategory,
  CONTACT,
  SOCIAL,
  STORE,
} from "./products.js";

/* ---------- Konfigurasi WhatsApp --------------------------------------- */
// Format nomor ke internasional (tambahkan '62' jika dimulai dengan '0').
function normalizePhone(number) {
  if (!number) return "";
  let n = String(number).replace(/\s+/g, "").replace(/^\+/, "");
  if (n.startsWith("0")) n = "62" + n.slice(1);
  return n;
}

function buildWhatsAppUrl(phone, message) {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${encoded}`;
}

/* ---------- Elemen DOM yang sering digunakan --------------------------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const toggle = $(".nav-toggle");
const drawer = $("#mobile-drawer");
const closeBtn = drawer ? drawer.querySelector(".drawer-close") : null;

/* ---------- Mobile drawer ---------------------------------------------- */
function openDrawer() {
  if (!drawer) return;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  if (toggle) toggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  if (toggle) toggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

if (toggle) toggle.addEventListener("click", openDrawer);
if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
if (drawer) {
  drawer.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeDrawer);
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && drawer && drawer.classList.contains("open")) {
    closeDrawer();
  }
});

/* ---------- Sticky header bayangan halus saat scroll ------------------- */
const header = $(".site-header");
if (header) {
  let last = 0;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (y > 4 && last <= 4) header.style.boxShadow = "0 8px 24px -16px rgba(0,0,0,0.6)";
      if (y <= 4 && last > 4) header.style.boxShadow = "none";
      last = y;
    },
    { passive: true }
  );
}

/* ---------- Render katalog produk -------------------------------------- */
function renderProductGrid(containerSelector, products, opts = {}) {
  const container = $(containerSelector);
  if (!container) return;

  const {
    showPrice = true,
    showActions = true,
    whatsappNumber: wNumber,
    defaultMessage: dMessage,
  } = opts;

  container.innerHTML = "";

  if (!products || products.length === 0) {
    container.innerHTML = `
      <section class="empty-state section--sm">
        <h2>Produk tidak tersedia</h2>
        <p>Saat ini belum ada produk yang terdaftar dalam katalog. Silakan hubungi kami untuk mengetahui ketersediaan.</p>
      </section>
    `;
    return;
  }

  products.forEach((product) => {
    const priceHtml = showPrice && product.price
      ? `<div class="product-card__price">Rp ${new Intl.NumberFormat("id-ID").format(product.price)}</div>`
      : "";
    const actionsHtml = showActions
      ? `
      <div class="product-card__actions">
        <a href="product.html?slug=${encodeURIComponent(product.slug)}" class="btn btn--ghost btn--sm">Lihat Detail</a>
        ${renderWhatsAppBtn(product, wNumber, dMessage, "Pesan via WhatsApp")}
      </div>
      `
      : "";

    container.insertAdjacentHTML(
      "beforeend",
      `
      <article class="product-card">
        <div class="product-card__media" aria-label="Foto ${product.name}">
          ${renderProductImage(product.image, product.name)}
          ${product.featured ? '<span class="product-card__badge">Unggulan</span>' : ""}
        </div>
        <div class="product-card__body">
          <span class="product-card__cat">${escapeHtml(product.category)}</span>
          <h3 class="product-card__name">${escapeHtml(product.name)}</h3>
          <p class="product-card__desc">${escapeHtml(product.description)}</p>
          ${priceHtml}
          ${actionsHtml}
        </div>
      </article>
      `
    );
  });
}

function renderProductImage(src, alt) {
  if (!src) {
    return `<div class="image-fallback">Gambar tidak tersedia</div>`;
  }
  return `<img src="${escapeHtml(src)}" loading="lazy" width="400" height="500" alt="${escapeHtml(alt)}" />`;
}

function renderWhatsAppBtn(product, number, defaultMessage, label) {
  if (!CONTACT.enabled || !number) return "";
  const message = defaultMessage
    ? `${defaultMessage} Produk: ${escapeHtml(product.name)}`
    : `Halo ST SUPPLY APPAREL, saya tertarik pada produk: ${escapeHtml(product.name)}`;
  const url = buildWhatsAppUrl(number, message);
  if (!url) return "";
  return `<a href="${url}" class="btn btn--primary btn--sm" target="_blank" rel="noopener">${label}</a>`;
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(String(text)));
  return div.innerHTML;
}

/* ---------- Filter kategori ------------------------------------------- */
function initCategoryFilter(productsSelector, btnContainerSelector) {
  const container = $(productsSelector);
  const btnContainer = $(btnContainerSelector);
  if (!container || !btnContainer) return;

  const categories = getCategories();
  if (categories.length === 0) {
    btnContainer.style.display = "none";
    return;
  }

  // Tombol "Semua"
  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className = "category-btn active";
  allBtn.textContent = "Semua";
  allBtn.setAttribute("aria-pressed", "true");
  btnContainer.appendChild(allBtn);

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "category-btn";
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      // Toggle aktif
      $$(".category-btn").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      const filtered = filterProductsByCategory(cat);
      renderProductGrid(productsSelector, filtered, {
        whatsappNumber: CONTACT.phoneNumber,
        defaultMessage: CONTACT.defaultMessage,
      });
    });
    btnContainer.appendChild(btn);
  });

  allBtn.addEventListener("click", () => {
    $$(".category-btn").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    allBtn.classList.add("active");
    allBtn.setAttribute("aria-pressed", "true");
    renderProductGrid(productsSelector, getPublishedProducts(), {
      whatsappNumber: CONTACT.phoneNumber,
      defaultMessage: CONTACT.defaultMessage,
    });
  });
}

/* ---------- Halaman detail produk -------------------------------------- */
function initProductDetail() {
  const detailContainer = $(".product-detail");
  if (!detailContainer) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const product = slug ? getProductBySlug(slug) : null;

  if (!product) {
    detailContainer.innerHTML = `
      <section class="empty-state section--sm">
        <h2>Produk tidak ditemukan</h2>
        <p>Produk yang Anda cari tidak tersedia. Kembali ke <a href="catalog.html">katalog</a>.</p>
      </section>
    `;
    return;
  }

  // Judul halaman
  document.title = `${product.name} — ${STORE.name}`;
  const metaDesc = $("meta[name='description']");
  if (metaDesc) metaDesc.setAttribute("content", product.description);

  const gallery = product.gallery && product.gallery.length
    ? product.gallery
    : [product.image];

  const mainImage = gallery[0] || "";
  const thumbsHtml = gallery
    .map(
      (img, i) =>
        `<div class="product-detail__thumb ${i === 0 ? "active" : ""}" data-img="${escapeHtml(img)}">
           ${renderProductImage(img, `${product.name} - gambar ${i + 1}`)}
         </div>`
    )
    .join("");

  const priceHtml = product.price
    ? `<div class="product-detail__price">Rp ${new Intl.NumberFormat("id-ID").format(product.price)}</div>`
    : `<div class="product-detail__not-available">Harga akan dikonfirmasi melalui kontak kami.</div>`;

  const metaRows = [];
  if (product.sizes) metaRows.push(`<div class="product-detail__meta-item"><b>Ukuran:</b> ${escapeHtml(product.sizes)}</div>`);
  if (product.colors) metaRows.push(`<div class="product-detail__meta-item"><b>Warna:</b> ${escapeHtml(product.colors)}</div>`);
  if (product.material) metaRows.push(`<div class="product-detail__meta-item"><b>Bahan:</b> ${escapeHtml(product.material)}</div>`);
  if (product.sku) metaRows.push(`<div class="product-detail__meta-item"><b>SKU:</b> ${escapeHtml(product.sku)}</div>`);
  const metaHtml = metaRows.length ? `<div class="product-detail__meta">${metaRows.join("")}</div>` : "";

  const marketplaceUrl = product.marketplaceUrl;
  const waUrl = buildWhatsAppUrl(
    CONTACT.phoneNumber,
    `Halo ST SUPPLY APPAREL, saya tertarik membeli produk: ${escapeHtml(product.name)}`
  );

  let actionsHtml = "";
  if (marketplaceUrl) {
    actionsHtml += `<a href="${escapeHtml(marketplaceUrl)}" class="btn btn--primary btn--lg" target="_blank" rel="noopener">Beli Produk</a>`;
  } else if (CONTACT.enabled && CONTACT.phoneNumber && waUrl) {
    actionsHtml += `<a href="${waUrl}" class="btn btn--primary btn--lg" target="_blank" rel="noopener">Pesan via WhatsApp</a>`;
  } else {
    actionsHtml += `<a href="contact.html" class="btn btn--ghost btn--lg">Konsultasikan Kebutuhan</a>`;
  }

  detailContainer.innerHTML = `
    <div class="product-detail__gallery">
      <div class="product-detail__hero" aria-label="Foto utama ${product.name}">
        ${renderProductImage(mainImage, product.name)}
      </div>
      <div class="product-detail__thumbs">${thumbsHtml}</div>
    </div>
    <div class="product-detail__info">
      <span class="product-detail__cat">${escapeHtml(product.category)}</span>
      <h1 class="product-detail__name">${escapeHtml(product.name)}</h1>
      ${priceHtml}
      <p class="product-detail__desc">${escapeHtml(product.description)}</p>
      ${metaHtml}
      <div class="product-detail__actions">
        ${actionsHtml}
      </div>
    </div>
  `;

  // Ganti gambar utama saat klik thumbnail
  detailContainer.querySelectorAll(".product-detail__thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const imgSrc = thumb.getAttribute("data-img");
      const hero = detailContainer.querySelector(".product-detail__hero");
      const img = hero.querySelector("img");
      if (img && imgSrc) img.src = imgSrc;
      detailContainer.querySelectorAll(".product-detail__thumb").forEach((t) =>
        t.classList.remove("active")
      );
      thumb.classList.add("active");
    });
  });
}

/* ---------- Tautan kontak / channel ----------------------------------- */
function initContactLinks() {
  // Tautan WhatsApp di halaman contact
  const waBtns = $$('a[href="https://wa.me/"]');
  waBtns.forEach((btn) => {
    const url = buildWhatsAppUrl(CONTACT.phoneNumber, CONTACT.defaultMessage);
    if (url) btn.setAttribute("href", url);
    else btn.closest(".channel-card")?.classList.add("hidden");
  });

  // Sosial media: sembunyikan channel yang kosong
  const channelMap = {
    'a[href="https://instagram.com/"]': SOCIAL.instagram,
    'a[href="https://tiktok.com/"]': SOCIAL.tiktok,
    'a[href="https://youtube.com/"]': SOCIAL.youtube,
    'a[href="https://facebook.com/"]': SOCIAL.facebook,
    'a[href="https://shopee.co.id/"]': SOCIAL.shopee,
  };
  Object.entries(channelMap).forEach(([selector, value]) => {
    const el = $(selector);
    if (el) {
      if (!value) {
        el.closest(".channel-card")?.classList.add("hidden");
      } else {
        el.setAttribute("href", value);
      }
    }
  });

  // Linktree fallback
  const linktreeEl = $('a[href="https://linktr.ee/"]');
  if (linktreeEl) linktreeEl.setAttribute("href", SOCIAL.linktree);

  // Alamat toko
  const addrEl = $(".store-address");
  if (addrEl) {
    if (!STORE.addressVerified) {
      addrEl.textContent = "Alamat toko akan diverifikasi dan ditampilkan segera.";
    } else {
      addrEl.textContent = STORE.address;
    }
  }

  // Tahun hak cipta dinamis
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- Ekpor untuk halaman yang memerlukan render manual ---------- */
export { renderProductGrid, initCategoryFilter, buildWhatsAppUrl, normalizePhone };

/* ---------- Inisialisasi saat DOM siap --------------------------------- */
function init() {
  initContactLinks();
  initProductDetail();

  // Katalog: inisialisasi otomatis jika elemen katalog ada di halaman ini.
  const catalogGrid = $("#featured-grid") || $("#catalog-grid");
  if (catalogGrid) {
    const categoryNav = $("#category-nav");
    renderProductGrid("#featured-grid", getFeaturedProducts(), {
      whatsappNumber: CONTACT.phoneNumber,
      defaultMessage: CONTACT.defaultMessage,
    });
    // Render full catalog in #catalog-grid if present (catalog page).
    const fullGrid = $("#catalog-grid");
    if (fullGrid) {
      renderProductGrid("#catalog-grid", getPublishedProducts(), {
        whatsappNumber: CONTACT.phoneNumber,
        defaultMessage: CONTACT.defaultMessage,
      });
      if (categoryNav) initCategoryFilter("#catalog-grid", "#category-nav");
    } else if (categoryNav) {
      initCategoryFilter("#featured-grid", "#category-nav");
    }
  }
}

// Reduced motion: nonaktifkan reveal jika diperlukan
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduced && "IntersectionObserver" in window) {
  const els = document.querySelectorAll(".reveal");
  if (els.length) {
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)";
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );
    els.forEach((el) => io.observe(el));
  }
}

init();
