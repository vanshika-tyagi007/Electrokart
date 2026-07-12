require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { checkUser } = require('./middleware/viewAuth');

// Connect Database
connectDB();

const app = express();

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(helmet({
  contentSecurityPolicy: false // disabled for now to allow inline scripts/styles if any
}));
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Apply checkUser middleware to all routes
app.use(checkUser);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// View Routes
app.get('/', (req, res) => res.render('pages/index', { title: 'Electrokart — Home', page: 'home' }));
app.get('/products', (req, res) => res.render('pages/products', { title: 'Electrokart — Shop', page: 'products' }));
app.get('/product', (req, res) => res.render('pages/product', { title: 'Electrokart — Product', page: 'products' }));
app.get('/cart', (req, res) => res.render('pages/cart', { title: 'Electrokart — Cart', page: 'cart' }));
app.get('/checkout', (req, res) => res.render('pages/checkout', { title: 'Electrokart — Checkout', page: 'checkout' }));
app.get('/login', (req, res) => res.render('pages/login', { title: 'Electrokart — Login', page: 'login' }));
app.get('/register', (req, res) => res.render('pages/register', { title: 'Electrokart — Register', page: 'register' }));
app.get('/orders', (req, res) => res.render('pages/orders', { title: 'Electrokart — Orders', page: 'orders' }));
app.get('/admin', (req, res) => res.render('pages/admin', { title: 'Electrokart — Admin Dashboard', page: 'admin' }));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
