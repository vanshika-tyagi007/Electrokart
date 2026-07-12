const Order = require('../models/Order');
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

module.exports = { createOrder, getUserOrders, getOrderById };