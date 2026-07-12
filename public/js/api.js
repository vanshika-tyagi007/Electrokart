// Electrokart — API client (session-cookie based)
const API_BASE = (window.__CONFIG__ && window.__CONFIG__.API_BASE)
  || (window.location.origin);
const API = `${API_BASE}/api`;

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = { error: text }; }
  if (!res.ok) {
    const err = new Error((data && data.error) || `Request failed: ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

window.api = {
  get: (p) => apiRequest(p),
  post: (p, body) => apiRequest(p, { method: 'POST', body: JSON.stringify(body || {}) }),
  put: (p, body) => apiRequest(p, { method: 'PUT', body: JSON.stringify(body || {}) }),
  del: (p) => apiRequest(p, { method: 'DELETE' }),
};

// Toast helper
window.toast = function (message, type = 'default', ms = 3200) {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = message;
  t.setAttribute('data-testid', 'toast');
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 500);
  }, ms);
};

// Money format
window.money = (n) => `$${(Number(n) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
