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

function initHeaderInteractions() {
  // Icons
  if (window.lucide) lucide.createIcons();
  
  // Show correct sun/moon based on theme
  applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
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
        setTimeout(() => window.location.href = '/', 400);
      });
      if (user.role === 'admin') {
        const link = document.getElementById('nav-admin-link');
        if (link) link.style.display = '';
      }
    } else {
      slot.innerHTML = `
        <a href="/login" class="btn btn-outline" data-testid="header-login-btn" style="padding: 0.6rem 1rem; font-size: 0.75rem;">Login</a>`;
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

async function logout() {
  try {
    await api.post('/auth/logout');
    window.location.href = '/';
  } catch(e) { console.error(e) }
}

document.addEventListener('DOMContentLoaded', () => {
  initHeaderInteractions();
  refreshCartCount();
});

window.refreshCartCount = refreshCartCount;
