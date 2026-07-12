const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'views', 'pages');

const views = {
  'products.ejs': `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <%- include('../partials/head') %>
</head>
<body data-page="products">
  <%- include('../partials/header') %>
  <main class="container" style="padding-top: 2rem;">
    <h1>All Products</h1>
    <div id="products-grid" class="product-grid">
      <!-- Products will be loaded via JS -->
    </div>
  </main>
  <%- include('../partials/footer') %>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="/js/api.js"></script>
  <script src="/js/ui.js"></script>
  <script>
    async function loadProducts() {
      try {
        const products = await api.get('/products');
        const grid = document.getElementById('products-grid');
        grid.innerHTML = products.map(p => \`
          <a href="/product?id=\${p._id}" class="product-card">
            <div class="product-img"><img src="\${p.images[0] || 'https://via.placeholder.com/300'}" alt="\${p.name}"></div>
            <div class="product-info">
              <span class="product-brand">\${p.brand}</span>
              <h3 class="product-title">\${p.name}</h3>
              <div class="product-price">$\${p.price}</div>
            </div>
          </a>
        \`).join('');
      } catch (err) {
        console.error(err);
      }
    }
    loadProducts();
  </script>
</body>
</html>`,

  'product.ejs': `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <%- include('../partials/head') %>
</head>
<body data-page="product">
  <%- include('../partials/header') %>
  <main class="container" style="padding-top: 2rem;" id="product-detail">
    <!-- Product detail loaded via JS -->
  </main>
  <%- include('../partials/footer') %>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="/js/api.js"></script>
  <script src="/js/ui.js"></script>
  <script>
    async function loadProduct() {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      try {
        const p = await api.get('/products/' + id);
        document.getElementById('product-detail').innerHTML = \`
          <div style="display:flex; gap:2rem;">
            <div style="flex:1"><img src="\${p.images[0] || 'https://via.placeholder.com/600'}" style="width:100%"></div>
            <div style="flex:1">
              <span class="small-caps">\${p.brand}</span>
              <h1>\${p.name}</h1>
              <h2 style="color:var(--accent-primary)">$\${p.price}</h2>
              <p>\${p.description}</p>
              <button class="btn btn-primary" onclick="addToCart('\${p._id}')">Add to Cart</button>
            </div>
          </div>
        \`;
      } catch (err) {
        console.error(err);
      }
    }
    async function addToCart(productId) {
      try {
        await api.post('/cart', { productId, quantity: 1 });
        window.refreshCartCount();
        alert('Added to cart!');
      } catch(e) { alert('Please login first') }
    }
    loadProduct();
  </script>
</body>
</html>`,

  'cart.ejs': `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <%- include('../partials/head') %>
</head>
<body data-page="cart">
  <%- include('../partials/header') %>
  <main class="container" style="padding-top: 2rem;">
    <h1>Your Cart</h1>
    <div id="cart-items"></div>
    <div style="margin-top:2rem">
      <a href="/checkout" class="btn btn-primary">Proceed to Checkout</a>
    </div>
  </main>
  <%- include('../partials/footer') %>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="/js/api.js"></script>
  <script src="/js/ui.js"></script>
  <script>
    async function loadCart() {
      try {
        const cart = await api.get('/cart');
        const container = document.getElementById('cart-items');
        if(!cart || !cart.items || cart.items.length === 0) {
          container.innerHTML = '<p>Your cart is empty.</p>';
          return;
        }
        container.innerHTML = cart.items.map(item => \`
          <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-color); padding:1rem 0;">
            <div>\${item.product.name} (x\${item.quantity})</div>
            <div>$\${item.price * item.quantity}</div>
          </div>
        \`).join('');
      } catch (err) {
        console.error(err);
      }
    }
    loadCart();
  </script>
</body>
</html>`,

  'checkout.ejs': `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <%- include('../partials/head') %>
</head>
<body data-page="checkout">
  <%- include('../partials/header') %>
  <main class="container" style="padding-top: 2rem; max-width: 600px;">
    <h1>Checkout</h1>
    <form id="checkout-form">
      <div class="form-group" style="margin-bottom:1rem">
        <label>Full Name</label>
        <input type="text" id="fullName" required style="width:100%; padding:0.5rem">
      </div>
      <div class="form-group" style="margin-bottom:1rem">
        <label>Address</label>
        <input type="text" id="address" required style="width:100%; padding:0.5rem">
      </div>
      <div class="form-group" style="margin-bottom:1rem">
        <label>City</label>
        <input type="text" id="city" required style="width:100%; padding:0.5rem">
      </div>
      <div class="form-group" style="margin-bottom:1rem">
        <label>Dummy Credit Card</label>
        <input type="text" value="4000 0000 0000 0000" disabled style="width:100%; padding:0.5rem">
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%">Confirm Order</button>
    </form>
  </main>
  <%- include('../partials/footer') %>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="/js/api.js"></script>
  <script src="/js/ui.js"></script>
  <script>
    document.getElementById('checkout-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const address = {
          fullName: document.getElementById('fullName').value,
          addressLine1: document.getElementById('address').value,
          city: document.getElementById('city').value,
          state: 'State',
          postalCode: '00000',
          country: 'Country',
          phoneNumber: '1234567890'
        };
        await api.post('/orders', { shippingAddress: address });
        alert('Order Placed Successfully!');
        window.location.href = '/orders';
      } catch (err) {
        alert('Error placing order');
      }
    });
  </script>
</body>
</html>`,

  'login.ejs': `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <%- include('../partials/head') %>
</head>
<body data-page="login">
  <%- include('../partials/header') %>
  <main class="container" style="padding-top: 4rem; max-width: 400px;">
    <h1>Login</h1>
    <form id="login-form">
      <div style="margin-bottom:1rem">
        <label>Email</label>
        <input type="email" id="email" required style="width:100%; padding:0.5rem">
      </div>
      <div style="margin-bottom:1rem">
        <label>Password</label>
        <input type="password" id="password" required style="width:100%; padding:0.5rem">
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%">Login</button>
      <p style="margin-top:1rem; text-align:center"><a href="/register">Don't have an account? Register</a></p>
    </form>
  </main>
  <%- include('../partials/footer') %>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="/js/api.js"></script>
  <script src="/js/ui.js"></script>
  <script>
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await api.post('/auth/login', {
          email: document.getElementById('email').value,
          password: document.getElementById('password').value
        });
        window.location.href = '/';
      } catch (err) {
        alert('Login failed');
      }
    });
  </script>
</body>
</html>`,

  'register.ejs': `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <%- include('../partials/head') %>
</head>
<body data-page="register">
  <%- include('../partials/header') %>
  <main class="container" style="padding-top: 4rem; max-width: 400px;">
    <h1>Register</h1>
    <form id="register-form">
      <div style="margin-bottom:1rem">
        <label>Name</label>
        <input type="text" id="name" required style="width:100%; padding:0.5rem">
      </div>
      <div style="margin-bottom:1rem">
        <label>Email</label>
        <input type="email" id="email" required style="width:100%; padding:0.5rem">
      </div>
      <div style="margin-bottom:1rem">
        <label>Password</label>
        <input type="password" id="password" required style="width:100%; padding:0.5rem">
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%">Register</button>
    </form>
  </main>
  <%- include('../partials/footer') %>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="/js/api.js"></script>
  <script src="/js/ui.js"></script>
  <script>
    document.getElementById('register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await api.post('/auth/register', {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value
        });
        window.location.href = '/';
      } catch (err) {
        alert('Registration failed');
      }
    });
  </script>
</body>
</html>`,

  'orders.ejs': `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <%- include('../partials/head') %>
</head>
<body data-page="orders">
  <%- include('../partials/header') %>
  <main class="container" style="padding-top: 2rem;">
    <h1>Your Orders</h1>
    <div id="orders-list"></div>
  </main>
  <%- include('../partials/footer') %>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="/js/api.js"></script>
  <script src="/js/ui.js"></script>
  <script>
    async function loadOrders() {
      try {
        const orders = await api.get('/orders/myorders');
        const container = document.getElementById('orders-list');
        if(orders.length === 0) {
          container.innerHTML = '<p>You have no orders.</p>';
          return;
        }
        container.innerHTML = orders.map(o => \`
          <div style="border:1px solid var(--border-color); padding:1rem; margin-bottom:1rem; border-radius:3px;">
            <h3>Order #\${o._id}</h3>
            <p>Total: $\${o.totalPrice}</p>
            <p>Status: \${o.orderStatus}</p>
          </div>
        \`).join('');
      } catch (err) {
        console.error(err);
      }
    }
    loadOrders();
  </script>
</body>
</html>`,

  'admin.ejs': `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <%- include('../partials/head') %>
</head>
<body data-page="admin">
  <%- include('../partials/header') %>
  <main class="container" style="padding-top: 2rem;">
    <h1>Admin Dashboard</h1>
    <div id="admin-stats" style="display:flex; gap:1rem; margin-bottom:2rem;"></div>
    <h2>Recent Orders</h2>
    <div id="admin-orders"></div>
  </main>
  <%- include('../partials/footer') %>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="/js/api.js"></script>
  <script src="/js/ui.js"></script>
  <script>
    async function loadAdmin() {
      try {
        const stats = await api.get('/admin/stats');
        document.getElementById('admin-stats').innerHTML = \`
          <div style="padding:1rem; border:1px solid var(--border-color); flex:1">Products: \${stats.productsCount}</div>
          <div style="padding:1rem; border:1px solid var(--border-color); flex:1">Users: \${stats.usersCount}</div>
          <div style="padding:1rem; border:1px solid var(--border-color); flex:1">Orders: \${stats.ordersCount}</div>
          <div style="padding:1rem; border:1px solid var(--border-color); flex:1">Revenue: $\${stats.revenue}</div>
        \`;
        
        const orders = await api.get('/admin/orders');
        document.getElementById('admin-orders').innerHTML = orders.map(o => \`
          <div style="border:1px solid var(--border-color); padding:1rem; margin-bottom:1rem;">
            User: \${o.user ? o.user.name : 'Unknown'} | Total: $\${o.totalPrice} | Status: \${o.orderStatus}
          </div>
        \`).join('');
      } catch (err) {
        console.error(err);
      }
    }
    loadAdmin();
  </script>
</body>
</html>`
};

for (const [filename, content] of Object.entries(views)) {
  fs.writeFileSync(path.join(pagesDir, filename), content);
}
console.log('Other Views generated successfully.');
