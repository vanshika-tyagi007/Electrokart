// Home page logic
async function loadHome() {
  try {
    const [featured, facets] = await Promise.all([
      api.get('/products?featured=true&limit=5'),
      api.get('/products/meta/facets'),
    ]);
    renderFeatured(featured.products || featured);
    renderBrands(facets.brands || []);
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
    <div class="product-card" data-testid="product-card-${p.slug}">
      <a href="/product?id=${p._id}" class="product-img" style="display:block; text-decoration:none;">
        ${discount ? `<span class="product-badge">-${discount}%</span>` : ''}
        <img src="${p.images[0] || ''}" alt="${p.name}" loading="lazy" />
      </a>
      <div class="product-body" style="padding: 1.5rem; display: flex; flex-direction: column; height: 100%;">
        <a href="/product?id=${p._id}" style="text-decoration:none; color:inherit; display:block; flex-grow: 1;">
          <span class="product-brand" style="color:var(--text-secondary); font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase;">${p.brand}</span>
          <h4 class="product-name" style="font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: 1.3rem; line-height: 1.2; margin-top: 0.25rem;">${p.name}</h4>
          <div class="product-meta" style="margin-top: 2.5rem; display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem;">
            <div>
              <span class="product-price" style="font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: 1.5rem;">${money(p.price)}</span>
              ${p.compareAtPrice ? `<span class="price-was">${money(p.compareAtPrice)}</span>` : ''}
            </div>
          </div>
        </a>
        <button class="btn btn-primary" onclick="window.addToCartHome('${p._id}')" style="margin-top: 1.5rem; width: 100%; justify-content: center; padding: 0.9rem;">Add to Cart</button>
      </div>
    </div>`;
}

window.addToCartHome = async function(productId) {
  try {
    await api.post('/cart', { productId, quantity: 1 });
    if (window.refreshCartCount) window.refreshCartCount();
    toast('Added to cart!', 'success');
  } catch(e) { 
    if (e.status === 401) {
      toast('Please login to add items to cart.', 'error');
      setTimeout(() => window.location.href = '/login', 1500);
    } else {
      toast('Failed to add to cart', 'error');
    }
  }
};

function renderBrands(brands) {
  const strip = document.getElementById('category-strip');
  strip.innerHTML = brands.map(b => `
    <a href="/products?brand=${encodeURIComponent(b)}" class="category-chip" data-testid="cat-chip-${b}">${b}</a>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadHome);
