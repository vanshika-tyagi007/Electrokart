require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

connectDB();

const updateImages = async () => {
    try {
        const products = await Product.find({});
        
        let updatedCount = 0;
        for (const p of products) {
            // Give each product a unique image based on its ID
            const uniqueImageUrl = `https://picsum.photos/seed/${p._id}/800/800`;
            p.images = [uniqueImageUrl];
            await p.save();
            updatedCount++;
        }

        console.log(`Successfully updated images for ${updatedCount} products!`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

updateImages();
