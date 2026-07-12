require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const connectDB = require('./config/db');

connectDB();

const seedProducts = async () => {
    try {
        const categoryNames = ['Audio', 'Wearables', 'Smartphones', 'Displays', 'Accessories'];
        const categories = {};
        
        for (const name of categoryNames) {
            let cat = await Category.findOne({ name });
            if (!cat) {
                cat = await Category.create({ name, slug: name.toLowerCase() });
            }
            categories[name] = cat._id;
        }

        const newProducts = [];
        
        for (let i = 1; i <= 10; i++) {
            newProducts.push({
                name: `Electrokart Echo Series ${i}`,
                description: `Next-generation wireless audio earbuds with active noise cancellation and ${i * 10} hour battery life.`,
                price: 100 + (i * 20) - 0.01,
                stock: 100,
                brand: 'Electrokart',
                sku: `Electrokart-AUDIO-${i}`,
                category: categories['Audio'],
                images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'],
                isFeatured: i % 5 === 0
            });
        }

        for (let i = 1; i <= 10; i++) {
            newProducts.push({
                name: `Electrokart Chronos Watch V${i}`,
                description: `Premium smartwatch featuring titanium casing, health tracking sensors, and GPS functionality version ${i}.`,
                price: 250 + (i * 30) - 0.01,
                stock: 50,
                brand: 'Electrokart',
                sku: `Electrokart-WEAR-${i}`,
                category: categories['Wearables'],
                images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
                isFeatured: i % 5 === 0
            });
        }

        for (let i = 1; i <= 10; i++) {
            newProducts.push({
                name: `Electrokart Nexus Phone ${i}`,
                description: `A flagship smartphone featuring edge-to-edge OLED display and pro-grade camera system Model ${i}.`,
                price: 600 + (i * 50) - 0.01,
                stock: 30,
                brand: 'Electrokart',
                sku: `Electrokart-PHONE-${i}`,
                category: categories['Smartphones'],
                images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'],
                isFeatured: i % 5 === 0
            });
        }

        for (let i = 1; i <= 10; i++) {
            newProducts.push({
                name: `Electrokart Vision Monitor ${i * 10}X`,
                description: `Ultra-wide high dynamic range monitor designed for creators and cinematic viewing, ${24 + i} inch.`,
                price: 300 + (i * 40) - 0.01,
                stock: 20,
                brand: 'Electrokart',
                sku: `Electrokart-DISP-${i}`,
                category: categories['Displays'],
                images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80'],
                isFeatured: i % 5 === 0
            });
        }

        for (let i = 1; i <= 5; i++) {
            newProducts.push({
                name: `Electrokart Power Adapter ${i}W`,
                description: `Fast-charging capable power adapter with universal USB-C ports.`,
                price: 29.99 + i * 5,
                stock: 200,
                brand: 'Electrokart',
                sku: `Electrokart-ACC-${i}`,
                category: categories['Accessories'],
                images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80'],
                isFeatured: false
            });
        }

        // Clean out existing test products maybe? Or just append. I will just append.
        await Product.insertMany(newProducts);

        console.log(`Successfully added ${newProducts.length} new products!`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedProducts();
