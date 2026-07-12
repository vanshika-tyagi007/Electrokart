require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

connectDB();

const correctMappings = {
    "MSI Titan GT77": { newName: "Lenovo Legion 9i", newBrand: "Lenovo" },
    "Dell Latitude 5540": { newName: "HP ProBook 450", newBrand: "HP" },
    "Microsoft Surface Laptop Go 3": { newName: "Lenovo ThinkPad E14", newBrand: "Lenovo" },
    "Lenovo Legion Pro 5i": { newName: "Asus ROG Flow X16", newBrand: "Asus" },
    "HP EliteBook 840 G10": { newName: "Asus ExpertBook B9", newBrand: "Asus" },
    "Microsoft Surface Laptop 6": { newName: "HP Elite Dragonfly", newBrand: "HP" },
    "Acer Chromebook Spin 714": { newName: "Asus Chromebook Flip", newBrand: "Asus" },
    "Lenovo ThinkBook 15": { newName: "Dell Vostro 15", newBrand: "Dell" },
    "MSI Stealth 16 AI Studio": { newName: "Dell G15 Gaming", newBrand: "Dell" },
    "Lenovo Yoga Pro 9i": { newName: "LG Gram Style", newBrand: "LG" },
    "HP Envy x360 15": { newName: "LG Gram 15", newBrand: "LG" },
    "HP Spectre x360 14": { newName: "LG Gram 14", newBrand: "LG" },
    "Dell Alienware m18 R2": { newName: "Razer Blade 18", newBrand: "Razer" },
    "Dell Inspiron 15": { newName: "Lenovo IdeaPad 5", newBrand: "Lenovo" },
    "Dell XPS 13": { newName: "Lenovo ThinkBook 13s", newBrand: "Lenovo" },
    "Apple MacBook Pro 14-inch M4 Pro": { newName: "MSI Creator 15", newBrand: "MSI" },
    "Apple MacBook Air M4 13-inch": { newName: "Razer Book 13", newBrand: "Razer" }
};

const updateBrands = async () => {
    try {
        const products = await Product.find({});
        for (const product of products) {
            const originalName = product.name;
            if (correctMappings[originalName]) {
                const mapping = correctMappings[originalName];
                console.log(`Renaming ${originalName} -> ${mapping.newName} (${mapping.newBrand})`);
                product.name = mapping.newName;
                product.brand = mapping.newBrand;
                await product.save();
            }
        }
        console.log("Finished updating product names to accurately match their image brands!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
updateBrands();
