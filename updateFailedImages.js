require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

connectDB();

const fallbacks = {
    "Apple MacBook Air M4 13-inch": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    "Apple MacBook Pro 14-inch M4 Pro": "https://images.unsplash.com/photo-1514342959091-2bffd8a7c4ba?w=800",
    "Dell XPS 13": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
    "Dell Inspiron 15": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
    "Dell Alienware m18 R2": "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=800",
    "HP Spectre x360 14": "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=800",
    "HP Envy x360 15": "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=800",
    "HP Victus 15": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800",
    "Lenovo ThinkPad X1 Carbon Gen 12": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
    "Lenovo Yoga Pro 9i": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    "Lenovo LOQ 15": "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800",
    "MSI Stealth 16 AI Studio": "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800",
    "MSI Katana 15": "https://images.unsplash.com/photo-1544281143-6c8fb735f470?w=800",
    "Razer Blade 16": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
};

const updateDB = async () => {
    try {
        const products = await Product.find({});
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            // If the product is currently using the generic fallback image
            if (product.images[0] === 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800') {
                if (fallbacks[product.name]) {
                    product.images = [fallbacks[product.name]];
                    await product.save();
                    console.log(`Updated failed image for ${product.name} to a reliable alternative.`);
                }
            }
        }
        console.log("Successfully replaced broken URLs with reliable alternatives!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

updateDB();
