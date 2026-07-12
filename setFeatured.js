require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

connectDB();

const setFeatured = async () => {
    try {
        const products = await Product.find({}).limit(5);
        for (const product of products) {
            product.isFeatured = true;
            await product.save();
        }
        console.log("Set 5 products as featured!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
setFeatured();
