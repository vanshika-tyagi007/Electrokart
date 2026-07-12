require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');
const fs = require('fs');
const path = require('path');

connectDB();
const laptopsDir = path.join(__dirname, 'public', 'images', 'laptops');

const runRevert = async () => {
    try {
        const files = fs.readdirSync(laptopsDir);
        const products = await Product.find({ sku: { $regex: /^LAPTOP-\d+$/ } });
        
        for (const product of products) {
            // Find original file: starts with laptop-{id}. and doesn't contain flipkart
            const originalFile = files.find(f => f.startsWith(`laptop-${product._id}.`) && !f.includes('flipkart'));
            if (originalFile) {
                product.images = [`/images/laptops/${originalFile}`];
                await product.save();
                console.log(`Reverted ${product.name} back to original image.`);
            }
        }
        console.log("Finished reverting images for main products.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

runRevert();
