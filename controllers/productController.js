const Product = require('../models/Product');
const Category = require('../models/Category');

const getProducts = async (req, res) => {
    try {
        let query = {};
        if (req.query.category) query.category = req.query.category;
        if (req.query.brand) query.brand = req.query.brand;
        if (req.query.search) query.name = { $regex: req.query.search, $options: 'i' };
        if (req.query.featured) query.isFeatured = true;

        let sort = {};
        if (req.query.sort === 'lowest_price') sort.price = 1;
        else if (req.query.sort === 'highest_price') sort.price = -1;
        else if (req.query.sort === 'newest') sort.createdAt = -1;
        else sort.createdAt = -1; // default

        const products = await Product.find(query).sort(sort).populate('category').lean();
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

const getFacets = async (req, res) => {
    try {
        const brands = await Product.distinct('brand');
        res.json({ brands });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getProducts, getProductById, getFacets };