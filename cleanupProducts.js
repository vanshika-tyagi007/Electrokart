require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');
const fs = require('fs');
const path = require('path');

connectDB();

const visualDescriptions = {
    "Lenovo LOQ 15": "Showcases a complete hardcore multi-monitor gaming setup, featuring dual displays, a mechanical keyboard, and atmospheric RGB room lighting.",
    "MSI Stealth 16 AI Studio": "Features a powerful custom PC build glowing with intense red internal LED lighting, visible through a sleek tempered glass side panel.",
    "Dell Alienware m18 R2": "A close-up shot capturing a user's hands actively typing on a premium laptop keyboard, illuminated by moody ambient lighting.",
    "Dell XPS 13": "Displays a sleek, modern silver laptop resting on a clean wooden desk, surrounded by natural lighting and a minimalist workspace.",
    "Lenovo Yoga Pro 9i": "A stunningly thin professional laptop sitting on a white desk next to a notebook, showcasing its edge-to-edge display.",
    "HP Spectre x360 14": "Features an elegant silver laptop slightly angled on a clean, modern office desk, highlighting its premium metal finish.",
    "Apple MacBook Air M4 13-inch": "A classic, minimalist Apple MacBook positioned gracefully on a smooth tabletop, demonstrating its incredibly thin profile.",
    "Apple MacBook Pro 14-inch M4 Pro": "A powerful space-gray Apple MacBook Pro opened on a desk, ready for professional creative workloads and editing.",
    "Dell Inspiron 15": "A reliable, professional silver laptop set against a clean office environment, perfect for everyday productivity.",
    "HP Envy x360 15": "A sophisticated convertible laptop resting on a modern workspace, with bright screen colors popping against the background.",
    "Lenovo ThinkPad X1 Carbon Gen 12": "The legendary matte-black business laptop shown on an office desk, showcasing its durable carbon-fiber build."
};

const cleanup = async () => {
    try {
        const products = await Product.find({});
        for (const product of products) {
            let shouldDelete = false;
            
            if (!product.images || product.images.length === 0) {
                shouldDelete = true;
            } else {
                const imgPath = product.images[0];
                if (imgPath.startsWith('/images/laptops/')) {
                    const fullPath = path.join(__dirname, 'public', imgPath);
                    if (!fs.existsSync(fullPath)) {
                        shouldDelete = true;
                    } else {
                        const stats = fs.statSync(fullPath);
                        // If file size is less than 20KB, it's either the generic Acer logo (18KB) or broken Asus icon (10KB)
                        if (stats.size < 20000) { 
                            shouldDelete = true;
                        }
                    }
                }
            }

            if (shouldDelete) {
                console.log(`Deleting product: ${product.name} (Broken/Missing image)`);
                await Product.deleteOne({ _id: product._id });
                continue;
            }

            // Update description based on the specific image visually shown
            if (visualDescriptions[product.name]) {
                product.description = visualDescriptions[product.name];
            } else {
                product.description = "A crisp studio product shot featuring the laptop against a clean, bright background, highlighting its keyboard layout, screen bezels, and premium chassis.";
            }
            await product.save();
            console.log(`Updated description for: ${product.name}`);
        }

        console.log("Cleanup and description updates completed.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
cleanup();
