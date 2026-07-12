const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'views');
const partialsDir = path.join(viewsDir, 'partials');
const pagesDir = path.join(viewsDir, 'pages');

const head = `<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title><%= title %></title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/css/styles.css" />`;

const header = `<header class="site-header">
  <div class="container header-inner">
    <a href="/" class="brand" data-testid="brand-logo">
      <span class="brand-dot"></span> Electrokart
    </a>
    <nav aria-label="Primary">
      <ul class="nav-links">
        <li><a href="/" class="<% if (locals.page === 'home') { %>active<% } %>">Home</a></li>
        <li><a href="/products" class="<% if (locals.page === 'products') { %>active<% } %>">Shop</a></li>
        <% if (locals.user) { %>
          <li><a href="/orders" class="<% if (locals.page === 'orders') { %>active<% } %>">Orders</a></li>
        <% } %>
        <% if (locals.user && locals.user.role === 'admin') { %>
          <li><a href="/admin" class="<% if (locals.page === 'admin') { %>active<% } %>">Admin</a></li>
        <% } %>
      </ul>
    </nav>
    <div class="header-actions">
      <button class="icon-btn" id="theme-toggle" aria-label="Toggle theme">
        <i data-lucide="sun" data-icon-sun></i>
        <i data-lucide="moon" data-icon-moon></i>
      </button>
      <a href="/cart" class="icon-btn" aria-label="Cart">
        <i data-lucide="shopping-bag"></i>
        <span class="cart-count" id="cart-count" style="display:none">0</span>
      </a>
      <span id="auth-slot">
        <% if (locals.user) { %>
          <div style="display:inline-flex; align-items:center; gap:0.5rem;">
            <span class="small-caps" style="color:var(--text-primary)"><%= user.name.split(' ')[0] %></span>
            <button class="icon-btn" id="logout-btn" aria-label="Logout" onclick="logout()">
              <i data-lucide="log-out"></i>
            </button>
          </div>
        <% } else { %>
          <a href="/login" class="btn btn-outline" style="padding: 0.6rem 1rem; font-size: 0.75rem;">Login</a>
        <% } %>
      </span>
    </div>
  </div>
</header>`;

const footer = `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="brand" style="margin-bottom: 0.75rem;"><span class="brand-dot"></span> Electrokart</div>
        <p style="color: var(--text-secondary); max-width: 40ch; font-size: 0.92rem;">
          Precision-engineered electronics for people who care about the details.
        </p>
      </div>
      <div>
        <h5>Shop</h5>
        <ul>
          <li><a href="/products?category=Audio">Audio</a></li>
          <li><a href="/products?category=Wearables">Wearables</a></li>
          <li><a href="/products?category=Smartphones">Smartphones</a></li>
          <li><a href="/products?category=Displays">Displays</a></li>
        </ul>
      </div>
      <div>
        <h5>Support</h5>
        <ul>
          <li><a href="#">Contact</a></li>
          <li><a href="#">Warranty</a></li>
          <li><a href="#">Shipping</a></li>
        </ul>
      </div>
      <div>
        <h5>Company</h5>
        <ul>
          <li><a href="#">About</a></li>
          <li><a href="#">Press</a></li>
          <li><a href="#">Careers</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Electrokart — Built for the future.</span>
      <span>ISO-9001 / CE / RoHS</span>
    </div>
  </div>
</footer>`;

const indexPage = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <%- include('../partials/head') %>
</head>
<body data-page="home">
  <%- include('../partials/header') %>
  <main>
    <!-- Hero -->
    <section class="hero container" data-testid="hero-section">
      <div class="hero-inner">
        <div class="hero-copy">
          <span class="eyebrow">// NEW COLLECTION — Q1.2026</span>
          <h1>Signal <br/><span class="accent">meets</span> silence.</h1>
          <p>Studio-grade wireless audio, titanium wearables, and cinematic drones — engineered for people who care about the details others miss.</p>
          <div class="hero-actions">
            <a href="/products" class="btn btn-primary" data-testid="hero-shop-btn">Shop the collection <i data-lucide="arrow-right" style="width:16px;height:16px"></i></a>
            <a href="/products?featured=true" class="btn btn-outline" data-testid="hero-featured-btn">See featured</a>
          </div>
        </div>
        <div class="hero-visual">
          <img src="https://images.unsplash.com/photo-1515940175183-6798529cb860?w=1600&q=85" alt="Electrokart Studio Wireless Headphones" />
          <span class="hero-tag">// Electrokart Studio · Pearl</span>
        </div>
      </div>
    </section>

    <!-- Marquee -->
    <div class="marquee" aria-hidden="true">
      <div class="marquee-track">
        <span>Free worldwide shipping</span>
        <span>1-year warranty</span>
        <span>Next-gen audio</span>
        <span>Titanium engineering</span>
        <span>Free worldwide shipping</span>
        <span>1-year warranty</span>
        <span>Next-gen audio</span>
        <span>Titanium engineering</span>
      </div>
    </div>

    <!-- Categories -->
    <section class="section container" data-testid="categories-section">
      <div class="section-head">
        <div>
          <span class="small-caps">// 01 · Categories</span>
          <h2 style="margin-top:1rem">Every category. <br/>Curated ruthlessly.</h2>
        </div>
        <a href="/products" class="btn btn-outline">All products</a>
      </div>
      <div class="category-strip" id="category-strip"></div>
    </section>

    <!-- Featured products -->
    <section class="section container" data-testid="featured-section">
      <div class="section-head">
        <div>
          <span class="small-caps">// 02 · Featured</span>
          <h2 style="margin-top:1rem">The current <span style="color:var(--accent-primary)">obsession.</span></h2>
        </div>
        <a href="/products" class="btn btn-outline">Shop all</a>
      </div>
      <div class="product-grid bento" id="featured-grid"></div>
    </section>

    <!-- Value blocks -->
    <section class="section container">
      <div class="section-head">
        <div>
          <span class="small-caps">// 03 · Why Electrokart</span>
          <h2 style="margin-top:1rem">Details others miss.</h2>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem" id="value-blocks">
        <div style="border:1px solid var(--border-color);padding:2rem;background:var(--bg-surface);border-radius:3px">
          <i data-lucide="cpu" style="color:var(--accent-primary);width:32px;height:32px;margin-bottom:1rem"></i>
          <h4>Engineered in-house</h4>
          <p style="color:var(--text-secondary);margin-top:0.5rem">Every chip, driver and hinge is designed and tested by our own engineers.</p>
        </div>
        <div style="border:1px solid var(--border-color);padding:2rem;background:var(--bg-surface);border-radius:3px">
          <i data-lucide="shield-check" style="color:var(--accent-primary);width:32px;height:32px;margin-bottom:1rem"></i>
          <h4>1-year warranty</h4>
          <p style="color:var(--text-secondary);margin-top:0.5rem">Zero-fuss coverage on every product, backed by real humans.</p>
        </div>
        <div style="border:1px solid var(--border-color);padding:2rem;background:var(--bg-surface);border-radius:3px">
          <i data-lucide="package" style="color:var(--accent-primary);width:32px;height:32px;margin-bottom:1rem"></i>
          <h4>Free shipping</h4>
          <p style="color:var(--text-secondary);margin-top:0.5rem">Complimentary worldwide shipping on orders over $500.</p>
        </div>
      </div>
    </section>
  </main>
  <%- include('../partials/footer') %>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="/js/api.js"></script>
  <script src="/js/ui.js"></script>
  <script src="/js/home.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(partialsDir, 'head.ejs'), head);
fs.writeFileSync(path.join(partialsDir, 'header.ejs'), header);
fs.writeFileSync(path.join(partialsDir, 'footer.ejs'), footer);
fs.writeFileSync(path.join(pagesDir, 'index.ejs'), indexPage);
console.log('Views generated successfully.');
