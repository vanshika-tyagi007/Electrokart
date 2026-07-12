// Electrokart — Shared UI (header, footer, theme, cart badge, auth state)

const THEME_KEY = 'electrokart-theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const sun = document.querySelector('[data-icon-sun]');
  const moon = document.querySelector('[data-icon-moon]');
  if (sun && moon) {
    sun.style.display = theme === 'dark' ? 'inline-flex' : 'none';
    moon.style.display = theme === 'dark' ? 'none' : 'inline-flex';
  }
}

function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  applyTheme(stored || 'dark');
}
initTheme();

function renderHeader() {
  const activePage = document.body.dataset.page || '';
  const headerHTML = `
  <header class="site-header">
    <div class="container header-inner">
      <a href="/index.html" class="brand" data-testid="brand-logo">
        <span class="brand-dot"></span> Electrokart
      </a>
      <nav aria-label="Primary">
        <ul class="nav-links">
          <li><a href="/index.html" class="${activePage === 'home' ? 'active' : ''}" data-testid="nav-home">Home</a></li>
          <li><a href="/products.html" class="${activePage === 'products' ? 'active' : ''}" data-testid="nav-products">Shop</a></li>
          <li><a href="/orders.html" class="${activePage === 'orders' ? 'active' : ''}" data-testid="nav-orders">Orders</a></li>
          <li><a href="/admin.html" class="${activePage === 'admin' ? 'active' : ''}" data-testid="nav-admin" id="nav-admin-link" style="display:none">Admin</a></li>
        </ul>
      </nav>
      <div class="header-actions">
        <button class="icon-btn" id="theme-toggle" data-testid="theme-toggle" aria-label="Toggle theme">
          <i data-lucide="sun" data-icon-sun></i>
          <i data-lucide="moon" data-icon-moon></i>
        </button>
        <a href="/cart.html" class="icon-btn" data-testid="cart-btn" aria-label="Cart">
          <i data-lucide="shopping-bag"></i>
          <span class="cart-count" id="cart-count" data-testid="cart-count" style="display:none">0</span>
        </a>
        <span id="auth-slot"></span>
      </div>
    </div>
  </header>`;
  document.getElementById('header-slot').innerHTML = headerHTML;

  // Icons
  if (window.lucide) lucide.createIcons();
  // Show correct sun/moon based on theme
  applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');

  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

function renderFooter() {
  const footerHTML = `
  <footer class="site-footer">
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
            <li><a href="/products.html?category=Audio">Audio</a></li>
            <li><a href="/products.html?category=Wearables">Wearables</a></li>
            <li><a href="/products.html?category=Smartphones">Smartphones</a></li>
            <li><a href="/products.html?category=Displays">Displays</a></li>
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
  document.getElementById('footer-slot').innerHTML = footerHTML;
}

async function refreshAuthState() {
  try {
    const { user } = await api.get('/auth/me');
    const slot = document.getElementById('auth-slot');
    if (user) {
      slot.innerHTML = `
        <div style="display:inline-flex; align-items:center; gap:0.5rem;">
          <span class="small-caps" data-testid="user-greeting" style="color:var(--text-primary)">${user.name.split(' ')[0]}</span>
          <button class="icon-btn" id="logout-btn" data-testid="logout-btn" aria-label="Logout">
            <i data-lucide="log-out"></i>
          </button>
        </div>`;
      if (window.lucide) lucide.createIcons();
      document.getElementById('logout-btn').addEventListener('click', async () => {
        await api.post('/auth/logout');
        toast('Logged out', 'success');
        setTimeout(() => window.location.href = '/index.html', 400);
      });
      if (user.role === 'admin') {
        const link = document.getElementById('nav-admin-link');
        if (link) link.style.display = '';
      }
    } else {
      slot.innerHTML = `
        <a href="/login.html" class="btn btn-outline" data-testid="header-login-btn" style="padding: 0.6rem 1rem; font-size: 0.75rem;">Login</a>`;
    }
  } catch (e) { /* ignore */ }
}

async function refreshCartCount() {
  try {
    const { items } = await api.get('/cart');
    const count = items.reduce((a, i) => a + i.quantity, 0);
    const el = document.getElementById('cart-count');
    if (!el) return;
    if (count > 0) {
      el.style.display = 'inline-flex';
      el.textContent = count;
    } else {
      el.style.display = 'none';
    }
  } catch (e) { /* ignore */ }
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  refreshAuthState();
  refreshCartCount();
});

window.refreshCartCount = refreshCartCount;
