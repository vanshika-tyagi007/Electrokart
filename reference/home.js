// Home page logic
async function loadHome() {
  try {
    const [featured, facets] = await Promise.all([
      api.get('/products?featured=true&limit=5'),
      api.get('/products/meta/facets'),
    ]);
    renderFeatured(featured.products);
    renderCategories(facets.categories);
    if (window.lucide) lucide.createIcons();
  } catch (e) {
    console.error(e);
    toast('Failed to load products', 'error');
  }
}

function renderFeatured(products) {
  const grid = document.getElementById('featured-grid');
  grid.innerHTML = products.map(p => productCard(p)).join('');
}

function productCard(p) {
  const discount = p.compareAtPrice ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0;
  return `
    <a href="/product.html?slug=${encodeURIComponent(p.slug)}" class="product-card" data-testid="product-card-${p.slug}">
      <div class="product-img">
        ${discount ? `<span class="product-badge">-${discount}%</span>` : ''}
        <img src="${p.images[0] || ''}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="product-body">
        <span class="product-brand">${p.brand}</span>
        <h4 class="product-name">${p.name}</h4>
        <div class="product-meta">
          <div>
            <span class="product-price">${money(p.price)}</span>
            ${p.compareAtPrice ? `<span class="price-was">${money(p.compareAtPrice)}</span>` : ''}
          </div>
          <span class="product-rating">
            <span class="star">★</span> ${p.ratingAvg || '—'} ${p.ratingCount ? `(${p.ratingCount})` : ''}
          </span>
        </div>
      </div>
    </a>`;
}

function renderCategories(categories) {
  const strip = document.getElementById('category-strip');
  strip.innerHTML = categories.map(c => `
    <a href="/products.html?category=${encodeURIComponent(c)}" class="category-chip" data-testid="cat-chip-${c}">${c}</a>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadHome);
