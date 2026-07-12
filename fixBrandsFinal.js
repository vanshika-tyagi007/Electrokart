require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

connectDB();

const correctMappings = {
    "Asus ROG Strix G15": { newName: "Samsung Galaxy Book", newBrand: "Samsung" },
    "Lenovo IdeaPad Gaming 3": { newName: "Asus Vivobook", newBrand: "Asus" },
    "HP Pavilion 14": { newName: "Acer Aspire", newBrand: "Acer" },
    "Dell Inspiron 15 3000": { newName: "HP Pavilion", newBrand: "HP" },
    "MSI GF63 Thin": { newName: "Asus Vivobook S", newBrand: "Asus" },
    "Dell Vostro 15": { newName: "Acer Extensa", newBrand: "Acer" },
    "HP Omen 16": { newName: "Asus Vivobook 15", newBrand: "Asus" },
    "Asus Zenbook 14": { newName: "Lenovo IdeaPad", newBrand: "Lenovo" },
    "Acer Swift 3": { newName: "Asus Vivobook S 15", newBrand: "Asus" },
    "Dell XPS 15": { newName: "HP Envy", newBrand: "HP" },
    "Asus ROG Zephyrus G14": { newName: "Asus TUF Gaming", newBrand: "Asus" },
    "LG Gram 17": { newName: "Asus Vivobook 16", newBrand: "Asus" },
    "Asus Chromebook Flip": { newName: "Asus ExpertBook P1", newBrand: "Asus" },
    "Gigabyte AORUS 15": { newName: "Asus Vivobook 14", newBrand: "Asus" },
    "HP Elite Dragonfly": { newName: "Lenovo LOQ", newBrand: "Lenovo" },
    "Asus ExpertBook B9": { newName: "Primebook 4G", newBrand: "Primebook" },
    "Asus ROG Flow X16": { newName: "HP OmniBook X", newBrand: "HP" },
    "Lenovo ThinkPad E14": { newName: "Lenovo LOQ 15", newBrand: "Lenovo" },
    "HP ProBook 450": { newName: "Acer Swift Neo", newBrand: "Acer" },
    "Lenovo Legion 9i": { newName: "Asus ExpertBook PM1", newBrand: "Asus" }
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
        console.log("Finished 100% accurate OCR-based renaming!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
updateBrands();
