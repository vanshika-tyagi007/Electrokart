const Wishlist = require('../models/Wishlist');

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

module.exports = { getWishlist, toggleWishlist };