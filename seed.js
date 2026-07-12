require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const connectDB = require('./config/db');

connectDB();

const seedData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@electrokart.com',
            password: 'password123',
            role: 'admin'
        });

        const user = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'user'
        });

        const catAudio = await Category.create({ name: 'Audio', slug: 'audio' });
        const catWearables = await Category.create({ name: 'Wearables', slug: 'wearables' });

        await Product.create({
            name: 'Electrokart Studio Headphones',
            description: 'Studio-grade wireless audio.',
            price: 299.99,
            stock: 50,
            brand: 'Electrokart',
            sku: 'Electrokart-ST-01',
            category: catAudio._id,
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
            isFeatured: true
        });

        await Product.create({
            name: 'Electrokart Titanium Watch',
            description: 'Titanium wearables engineered for durability.',
            price: 499.99,
            stock: 20,
            brand: 'Electrokart',
            sku: 'Electrokart-WT-01',
            category: catWearables._id,
            images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
            isFeatured: true
        });

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
