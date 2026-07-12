require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const connectDB = require('./config/db');

connectDB();

const audioImages = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80',
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
    'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=800&q=80'
];

const wearableImages = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80',
    'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&q=80'
];

const smartphoneImages = [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&q=80',
    'https://images.unsplash.com/photo-1533228100845-08145b01de14?w=800&q=80',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80'
];

const displayImages = [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80',
    'https://images.unsplash.com/photo-1586952518485-11b180e92764?w=800&q=80',
    'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800&q=80',
    'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&q=80'
];

const accessoryImages = [
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
    'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&q=80',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
    'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
    'https://images.unsplash.com/photo-1588156979402-171b3e8a4a58?w=800&q=80'
];

const descriptions = {
    audio: [
        "Experience studio-grade sound with deep bass and active noise cancellation. Perfect for long commutes and focused work sessions.",
        "High-fidelity wireless audio designed for the purist. Custom-tuned drivers deliver unmatched clarity across all frequencies.",
        "Ultra-lightweight and comfortable for all-day wear. Features ambient mode and crystal-clear microphone array for calls.",
        "Engineered for athletes, these earbuds are sweat-proof, secure-fitting, and deliver booming bass to push you further.",
        "Immerse yourself in 360-degree spatial audio. The perfect companion for cinematic movie watching and competitive gaming."
    ],
    wearables: [
        "A premium titanium smartwatch that tracks your fitness, sleep, and heart rate with medical-grade precision.",
        "Stay connected without your phone. This cellular-enabled wearable lets you take calls, stream music, and navigate anywhere.",
        "Designed for the extreme outdoors. Features sapphire glass, 100m water resistance, and a multi-band GPS system.",
        "Sleek and minimal. This fitness tracker blends seamlessly with your wardrobe while silently logging all your vital metrics.",
        "The ultimate companion for your wellness journey. Features advanced stress monitoring and recovery suggestions."
    ],
    smartphones: [
        "The most advanced camera system ever placed in a phone. Capture professional-grade photos and cinematic 8K video.",
        "Experience blazing fast speeds with the new ultra-efficient processor. Features an edge-to-edge OLED display with 120Hz refresh rate.",
        "A beautiful glass and aluminum design housing a battery that easily lasts two full days of heavy usage.",
        "Foldable technology perfected. Enjoy a massive tablet-sized screen that neatly folds right into your pocket.",
        "The perfect balance of performance and price. Features a gorgeous display, fast charging, and a dual-lens camera."
    ],
    displays: [
        "A massive 34-inch ultrawide curved monitor. Dive deeper into your work and games with unparalleled immersion.",
        "Professional color accuracy for creators. This 4K HDR display is factory-calibrated for perfect color reproduction.",
        "Built for esports. Experience lightning-fast 240Hz refresh rates and 1ms response time for a competitive edge.",
        "The perfect home office companion. Features built-in speakers, a webcam, and single-cable USB-C connectivity.",
        "A gorgeous 27-inch 5K display that brings your code, text, and photos to life with stunning clarity."
    ],
    accessories: [
        "A high-speed GaN charger that can simultaneously fast-charge your phone, tablet, and laptop.",
        "An ergonomic wireless mouse designed to reduce wrist strain during long hours of productive work.",
        "A premium mechanical keyboard with tactile switches, customizable RGB lighting, and a solid aluminum frame.",
        "Ultra-durable braided charging cable reinforced with kevlar. Guaranteed to withstand thousands of bends.",
        "A sleek wireless charging pad that elegantly charges all your devices on your nightstand."
    ]
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedProducts = async () => {
    try {
        await Product.deleteMany({}); // Clear all products to start fresh
        
        const categoryNames = ['Audio', 'Wearables', 'Smartphones', 'Displays', 'Accessories'];
        const categories = {};
        
        for (const name of categoryNames) {
            let cat = await Category.findOne({ name });
            if (!cat) cat = await Category.create({ name, slug: name.toLowerCase() });
            categories[name] = cat._id;
        }

        const newProducts = [];
        let skuCounter = 1;

        // Generate 10 Audio
        for (let i = 0; i < 10; i++) {
            newProducts.push({
                name: `Electrokart Audio System Pro ${i+1}`,
                description: getRandom(descriptions.audio),
                price: Math.floor(Math.random() * 300) + 99.99,
                stock: Math.floor(Math.random() * 100) + 10,
                brand: 'Electrokart',
                sku: `Electrokart-AUD-${skuCounter++}`,
                category: categories['Audio'],
                images: [getRandom(audioImages)],
                isFeatured: i < 2
            });
        }

        // Generate 10 Wearables
        for (let i = 0; i < 10; i++) {
            newProducts.push({
                name: `Electrokart Chronos Gen ${i+1}`,
                description: getRandom(descriptions.wearables),
                price: Math.floor(Math.random() * 400) + 199.99,
                stock: Math.floor(Math.random() * 100) + 10,
                brand: 'Electrokart',
                sku: `Electrokart-WEAR-${skuCounter++}`,
                category: categories['Wearables'],
                images: [getRandom(wearableImages)],
                isFeatured: i < 2
            });
        }

        // Generate 10 Smartphones
        for (let i = 0; i < 10; i++) {
            newProducts.push({
                name: `Electrokart Nexus ${i+1} Pro`,
                description: getRandom(descriptions.smartphones),
                price: Math.floor(Math.random() * 600) + 499.99,
                stock: Math.floor(Math.random() * 100) + 10,
                brand: 'Electrokart',
                sku: `Electrokart-PHO-${skuCounter++}`,
                category: categories['Smartphones'],
                images: [getRandom(smartphoneImages)],
                isFeatured: i < 2
            });
        }

        // Generate 10 Displays
        for (let i = 0; i < 10; i++) {
            newProducts.push({
                name: `Electrokart Vision ${24 + i}X`,
                description: getRandom(descriptions.displays),
                price: Math.floor(Math.random() * 500) + 299.99,
                stock: Math.floor(Math.random() * 100) + 10,
                brand: 'Electrokart',
                sku: `Electrokart-DISP-${skuCounter++}`,
                category: categories['Displays'],
                images: [getRandom(displayImages)],
                isFeatured: i < 2
            });
        }

        // Generate 10 Accessories
        for (let i = 0; i < 10; i++) {
            newProducts.push({
                name: `Electrokart Essential Accessory ${i+1}`,
                description: getRandom(descriptions.accessories),
                price: Math.floor(Math.random() * 80) + 19.99,
                stock: Math.floor(Math.random() * 100) + 10,
                brand: 'Electrokart',
                sku: `Electrokart-ACC-${skuCounter++}`,
                category: categories['Accessories'],
                images: [getRandom(accessoryImages)],
                isFeatured: false
            });
        }

        await Product.insertMany(newProducts);
        console.log(`Successfully added ${newProducts.length} high-quality products!`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedProducts();
