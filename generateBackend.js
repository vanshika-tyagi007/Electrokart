const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'controllers');
const routesDir = path.join(__dirname, 'routes');

const controllers = {
  'productController.js': `const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        let query = {};
        if (req.query.category) query.category = req.query.category;
        if (req.query.search) query.name = { $regex: req.query.search, $options: 'i' };
        if (req.query.featured) query.isFeatured = true;

        let sort = {};
        if (req.query.sort === 'lowest_price') sort.price = 1;
        else if (req.query.sort === 'highest_price') sort.price = -1;
        else if (req.query.sort === 'newest') sort.createdAt = -1;
        else sort.createdAt = -1; // default

        const products = await Product.find(query).sort(sort).populate('category');
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getProducts, getProductById };`,

  'categoryController.js': `const Category = require('../models/Category');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getCategories };`,

  'cartController.js': `const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (!cart) cart = new Cart({ user: req.user._id, items: [] });

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
            cart.items[itemIndex].price = product.price; // update price in case it changed
        } else {
            cart.items.push({ product: productId, quantity, price: product.price });
        }
        await cart.save();
        cart = await cart.populate('items.product');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const removeFromCart = async (req, res) => {
    const { productId } = req.params;
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        cart = await cart.populate('items.product');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateCartItem = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
        }
        cart = await cart.populate('items.product');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getCart, addToCart, removeFromCart, updateCartItem };`,

  'wishlistController.js': `const Wishlist = require('../models/Wishlist');

const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [] });
        }
        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const toggleWishlist = async (req, res) => {
    const { productId } = req.body;
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id });
        if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });

        if (wishlist.products.includes(productId)) {
            wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
        } else {
            wishlist.products.push(productId);
        }
        await wishlist.save();
        wishlist = await wishlist.populate('products');
        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getWishlist, toggleWishlist };`,

  'orderController.js': `const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Address = require('../models/Address');

const createOrder = async (req, res) => {
    const { shippingAddress, paymentMethod } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'No cart items' });

        // Let's create an address if shippingAddress is raw data
        let addressObj;
        if (typeof shippingAddress === 'string') {
            addressObj = await Address.findById(shippingAddress);
        } else {
            addressObj = await Address.create({ ...shippingAddress, user: req.user._id });
        }

        const orderItems = cart.items.map(item => ({
            name: item.product.name,
            qty: item.quantity,
            image: item.product.images[0] || '',
            price: item.price,
            product: item.product._id
        }));

        const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
        const taxPrice = itemsPrice * 0.1; // 10% tax dummy
        const shippingPrice = itemsPrice > 500 ? 0 : 25;
        const totalPrice = itemsPrice + taxPrice + shippingPrice;

        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress: addressObj._id,
            paymentMethod: paymentMethod || 'DummyPayment',
            taxPrice,
            shippingPrice,
            totalPrice,
            isPaid: true,
            paidAt: Date.now()
        });

        const createdOrder = await order.save();

        // Reduce inventory
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            product.stock -= item.qty;
            await product.save();
            await Inventory.create({ product: product._id, quantityChanged: -item.qty, type: 'remove', reason: 'Order ' + createdOrder._id, admin: req.user._id });
        }

        // Clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json(createdOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('shippingAddress');
        if (order && (order.user.toString() === req.user._id.toString() || req.user.role === 'admin')) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createOrder, getUserOrders, getOrderById };`,

  'adminController.js': `const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
    try {
        const productsCount = await Product.countDocuments();
        const usersCount = await User.countDocuments();
        const ordersCount = await Order.countDocuments();
        const orders = await Order.find({});
        const revenue = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);

        res.json({ productsCount, usersCount, ordersCount, revenue });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.orderStatus = req.body.status || order.orderStatus;
            await order.save();
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getDashboardStats, createProduct, updateProduct, deleteProduct, getAllOrders, updateOrderStatus };`
};

const routes = {
  'productRoutes.js': `const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;`,

  'categoryRoutes.js': `const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/categoryController');

router.get('/', getCategories);

module.exports = router;`,

  'cartRoutes.js': `const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, updateCartItem } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.delete('/:productId', protect, removeFromCart);
router.put('/:productId', protect, updateCartItem);

module.exports = router;`,

  'wishlistRoutes.js': `const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWishlist);
router.post('/', protect, toggleWishlist);

module.exports = router;`,

  'orderRoutes.js': `const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getUserOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;`,

  'adminRoutes.js': `const express = require('express');
const router = express.Router();
const { getDashboardStats, createProduct, updateProduct, deleteProduct, getAllOrders, updateOrderStatus } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.post('/products', protect, admin, createProduct);
router.put('/products/:id', protect, admin, updateProduct);
router.delete('/products/:id', protect, admin, deleteProduct);
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id', protect, admin, updateOrderStatus);

module.exports = router;`
};

for (const [filename, content] of Object.entries(controllers)) {
  fs.writeFileSync(path.join(controllersDir, filename), content);
}
for (const [filename, content] of Object.entries(routes)) {
  fs.writeFileSync(path.join(routesDir, filename), content);
}
console.log('Backend routes and controllers created successfully.');
