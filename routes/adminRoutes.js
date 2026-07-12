const express = require('express');
const router = express.Router();
const { getDashboardStats, createProduct, updateProduct, deleteProduct, getAllOrders, updateOrderStatus } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};

const productValidation = [
    body('name', 'Name is required').notEmpty(),
    body('price', 'Price must be a positive number').isFloat({ gt: 0 }),
    body('stock', 'Stock must be a non-negative integer').isInt({ min: 0 })
];

router.get('/stats', protect, admin, getDashboardStats);
router.post('/products', protect, admin, productValidation, validate, createProduct);
router.put('/products/:id', protect, admin, productValidation, validate, updateProduct);
router.delete('/products/:id', protect, admin, deleteProduct);
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id', protect, admin, updateOrderStatus);

module.exports = router;