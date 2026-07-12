require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const connectDB = require('./config/db');

connectDB();

// Hand-picked Unsplash URLs that match the categories well
const audioImages = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80',
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&q=80'
];

const wearableImages = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80', // Apple watch
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80', // Apple watch
    'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&q=80'
];

const smartphoneImages = [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', // iPhone
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&q=80',
    'https://images.unsplash.com/photo-1533228100845-08145b01de14?w=800&q=80',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80' // iPhone
];

const displayImages = [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80',
    'https://images.unsplash.com/photo-1586952518485-11b180e92764?w=800&q=80',
    'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800&q=80',
    'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&q=80'
];

const accessoryImages = [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80', // Keyboard
    'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80', // Keyboard
    'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&q=80', // Mouse
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80', // Charger
    'https://images.unsplash.com/photo-1588156979402-171b3e8a4a58?w=800&q=80'  // Cable
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const realProducts = [
    // AUDIO
    { brand: 'Sony', name: 'Sony WH-1000XM5 Wireless Headphones', price: 398.00, desc: 'Industry-leading noise canceling with two processors controlling 8 microphones for unprecedented noise cancellation.', images: audioImages },
    { brand: 'Apple', name: 'AirPods Pro (2nd Generation)', price: 249.00, desc: 'Rich, high-quality audio and voice. Active Noise Cancellation reduces unwanted background noise.', images: audioImages },
    { brand: 'Bose', name: 'Bose QuietComfort Ultra Headphones', price: 429.00, desc: 'World-class noise cancellation, quieter than ever before. Breakthrough spatialized audio for immersive listening.', images: audioImages },
    { brand: 'Sennheiser', name: 'Sennheiser Momentum 4 Wireless', price: 349.95, desc: 'Maximum audio resolution with Sennheiser Signature Sound. Next-generation Adaptive Noise Cancellation.', images: audioImages },
    { brand: 'Beats', name: 'Beats Studio Pro', price: 349.99, desc: 'Custom acoustic platform delivers rich, immersive sound whether you’re listening to music or taking calls.', images: audioImages },
    { brand: 'Samsung', name: 'Samsung Galaxy Buds2 Pro', price: 229.99, desc: 'Intelligent Active Noise Cancellation quiets even the loudest outside sounds. Studio quality sound.', images: audioImages },
    { brand: 'Jabra', name: 'Jabra Elite 10 True Wireless', price: 249.99, desc: 'Advanced Active Noise Cancellation (ANC). Spatial Sound with Dolby Head Tracking for a fully immersive experience.', images: audioImages },
    { brand: 'Shure', name: 'Shure AONIC 50 Gen 2', price: 349.00, desc: 'Premium studio-quality sound with adjustable noise cancellation. Engineered from decades of stage and studio experience.', images: audioImages },
    { brand: 'Bang & Olufsen', name: 'Bang & Olufsen Beoplay H95', price: 899.00, desc: 'Ultimate over-ear headphones with titanium drivers and customized active noise cancellation.', images: audioImages },
    { brand: 'JBL', name: 'JBL Tour One M2', price: 299.95, desc: 'True Adaptive Noise Cancelling technology automatically uses 4 noise sensing mics to adjust to your surroundings in real-time.', images: audioImages },

    // WEARABLES
    { brand: 'Apple', name: 'Apple Watch Series 9', price: 399.00, desc: 'S9 chip enables a superbright display and a magical new way to quickly and easily interact with your Apple Watch without touching the screen.', images: wearableImages },
    { brand: 'Apple', name: 'Apple Watch Ultra 2', price: 799.00, desc: 'Rugged and capable, built to meet the demands of endurance athletes, outdoor adventurers, and water sports enthusiasts.', images: wearableImages },
    { brand: 'Samsung', name: 'Samsung Galaxy Watch 6 Classic', price: 399.99, desc: 'The iconic rotating bezel is back. Featuring advanced sleep tracking, personalized heart rate zones, and a larger display.', images: wearableImages },
    { brand: 'Garmin', name: 'Garmin Fenix 7 Pro Sapphire Solar', price: 899.99, desc: 'Ultimate multisport GPS smartwatch with a scratch-resistant Power Sapphire solar charging lens and built-in LED flashlight.', images: wearableImages },
    { brand: 'Fitbit', name: 'Fitbit Charge 6', price: 159.95, desc: 'The #1 fitness tracker. Now with Google apps, built-in GPS, and the most accurate heart rate on a Fitbit tracker yet.', images: wearableImages },
    { brand: 'Whoop', name: 'Whoop 4.0 Health and Fitness Tracker', price: 239.00, desc: 'In-depth continuous monitoring of your sleep, training, recovery, and health. Screen-free design.', images: wearableImages },
    { brand: 'Oura', name: 'Oura Ring Gen3 Horizon', price: 349.00, desc: 'A revolutionary smart ring that tracks your sleep, activity, and recovery directly from your finger.', images: wearableImages },
    { brand: 'Google', name: 'Google Pixel Watch 2', price: 349.99, desc: 'Three new advanced sensors for heart rate tracking, skin temperature, and stress management, powered by Fitbit.', images: wearableImages },
    { brand: 'Amazfit', name: 'Amazfit GTR 4 Smartwatch', price: 199.99, desc: 'Industry-first dual-band circularly-polarized GPS antenna. Up to 14 days of battery life.', images: wearableImages },
    { brand: 'Suunto', name: 'Suunto 9 Peak Pro', price: 549.00, desc: 'Ultra-thin, tough GPS watch with military-grade durability, outstanding battery life, and fast processor.', images: wearableImages },

    // SMARTPHONES
    { brand: 'Apple', name: 'iPhone 15 Pro Max', price: 1199.00, desc: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and a 5x Telephoto camera.', images: smartphoneImages },
    { brand: 'Apple', name: 'iPhone 15', price: 799.00, desc: 'Dynamic Island bubbles up alerts and Live Activities. Featuring a 48MP Main camera and USB-C.', images: smartphoneImages },
    { brand: 'Samsung', name: 'Samsung Galaxy S24 Ultra', price: 1299.99, desc: 'Galaxy AI is here. Epic titanium exterior. Built-in S Pen. 200MP camera setup with new AI zoom capabilities.', images: smartphoneImages },
    { brand: 'Samsung', name: 'Samsung Galaxy Z Fold5', price: 1799.99, desc: 'The ultimate 7.6" Main Screen. Thinner, lighter, and more portable than ever, all while delivering PC-like power.', images: smartphoneImages },
    { brand: 'Google', name: 'Google Pixel 8 Pro', price: 999.00, desc: 'Engineered by Google, featuring the new Tensor G3 chip and next-level AI features like Magic Editor and Video Boost.', images: smartphoneImages },
    { brand: 'OnePlus', name: 'OnePlus 12', price: 799.99, desc: 'Smooth beyond belief. Powered by Snapdragon 8 Gen 3, a massive 5400mAh battery, and 4th Gen Hasselblad Camera for Mobile.', images: smartphoneImages },
    { brand: 'Nothing', name: 'Nothing Phone (2)', price: 599.00, desc: 'Come to the bright side. Featuring the new Glyph Interface, a customized Snapdragon 8+ Gen 1, and a dual 50MP camera.', images: smartphoneImages },
    { brand: 'Sony', name: 'Sony Xperia 1 V', price: 1398.00, desc: 'Next-gen sensor technology meets computational processing. Designed for creators with true optical zoom.', images: smartphoneImages },
    { brand: 'Asus', name: 'Asus ROG Phone 8 Pro', price: 1199.99, desc: 'Beyond gaming. Features the Snapdragon 8 Gen 3, 165Hz AMOLED display, and a new premium, thinner design.', images: smartphoneImages },
    { brand: 'Motorola', name: 'Motorola Razr+', price: 999.99, desc: 'The largest, most advanced external display on a flip phone. Unfold a fully immersive 6.9" pOLED screen.', images: smartphoneImages },

    // DISPLAYS
    { brand: 'Apple', name: 'Apple Studio Display', price: 1599.00, desc: 'An immersive 27-inch 5K Retina display with a 12MP Ultra Wide camera with Center Stage, and studio-quality mics.', images: displayImages },
    { brand: 'LG', name: 'LG UltraGear 27" OLED Gaming Monitor', price: 899.99, desc: '240Hz refresh rate and 0.03ms response time. True OLED blacks and infinite contrast for the ultimate gaming setup.', images: displayImages },
    { brand: 'Samsung', name: 'Samsung Odyssey G9 49" Curved', price: 1299.99, desc: 'A dual QHD 49-inch curved monitor wrapping around your field of view with a 240Hz refresh rate.', images: displayImages },
    { brand: 'Dell', name: 'Dell UltraSharp 32" 4K USB-C Monitor', price: 879.99, desc: 'Brilliant 4K clarity with IPS Black technology delivering a 2000:1 contrast ratio. Perfect for productivity.', images: displayImages },
    { brand: 'ASUS', name: 'ASUS ROG Swift 27" 1440p', price: 699.00, desc: 'Tournament-ready 360Hz gaming monitor with NVIDIA G-SYNC and an ultra-fast IPS panel.', images: displayImages },
    { brand: 'BenQ', name: 'BenQ DesignVue 32" 4K Mac Ready', price: 799.99, desc: 'CalMAN verified and Pantone validated for absolute color precision. Thunderbolt 3 single-cable connectivity.', images: displayImages },
    { brand: 'Gigabyte', name: 'Gigabyte M32U 32" 144Hz 4K', price: 649.99, desc: 'The world’s first KVM gaming monitor. 4K resolution at 144Hz with HDMI 2.1 for next-gen consoles.', images: displayImages },
    { brand: 'Alienware', name: 'Alienware 34" Curved QD-OLED', price: 1099.99, desc: 'Quantum Dot-OLED technology delivers incredible brightness and color volume with an immersive curve.', images: displayImages },
    { brand: 'MSI', name: 'MSI Optix MAG274QRF-QD', price: 379.99, desc: 'Quantum dot technology provides accurate color imagery and supports a cinema-standard DCI-P3 color gamut.', images: displayImages },
    { brand: 'Acer', name: 'Acer Predator X27U 27" OLED', price: 899.99, desc: 'OLED gaming perfection with 240Hz refresh rate, AMD FreeSync Premium, and an incredibly thin design.', images: displayImages },

    // ACCESSORIES
    { brand: 'Logitech', name: 'Logitech MX Master 3S', price: 99.99, desc: 'The ultimate precision mouse. Features an 8K DPI track-on-glass sensor and Quiet Clicks technology.', images: accessoryImages },
    { brand: 'Keychron', name: 'Keychron Q1 Pro Wireless Mechanical Keyboard', price: 199.00, desc: 'A full metal QMK/VIA wireless custom mechanical keyboard. Connects with up to 3 devices via Bluetooth.', images: accessoryImages },
    { brand: 'Anker', name: 'Anker Prime 27,650mAh Power Bank', price: 179.99, desc: '250W multi-device fast charging. Features a smart digital display to monitor real-time charging status.', images: accessoryImages },
    { brand: 'Apple', name: 'Apple MagSafe Charger', price: 39.00, desc: 'Makes wireless charging a snap. Perfectly aligned magnets attach to your iPhone 15, 14, or 13.', images: accessoryImages },
    { brand: 'Belkin', name: 'Belkin BoostCharge Pro 3-in-1', price: 149.99, desc: 'Fast charge your Apple Watch, iPhone, and AirPods simultaneously with this MagSafe-certified charging stand.', images: accessoryImages },
    { brand: 'Razer', name: 'Razer DeathAdder V3 Pro', price: 149.99, desc: 'Ultra-lightweight wireless ergonomic esports mouse. Featuring the Focus Pro 30K Optical Sensor.', images: accessoryImages },
    { brand: 'Satechi', name: 'Satechi USB-C Multiport Adapter V2', price: 79.99, desc: 'Adds 4K HDMI, pass-through charging, Ethernet, SD/Micro card readers, and 3 USB-A ports to your setup.', images: accessoryImages },
    { brand: 'Elgato', name: 'Elgato Stream Deck MK.2', price: 149.99, desc: '15 customizable LCD keys to control apps, tools, and platforms. Perfect for streaming, video editing, and productivity.', images: accessoryImages },
    { brand: 'UGREEN', name: 'UGREEN Nexode 100W GaN Charger', price: 74.99, desc: 'Compact 4-port wall charger. Power up your MacBook, iPad, iPhone, and AirPods all at the same time.', images: accessoryImages },
    { brand: 'Logitech', name: 'Logitech Brio 4K Webcam', price: 159.99, desc: 'Ultra HD 4K webcam for video conferencing, recording, and streaming. Features HDR and Windows Hello support.', images: accessoryImages }
];

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
        let index = 0;

        for (const p of realProducts) {
            // Determine category based on index
            let catName = 'Accessories';
            if (index < 10) catName = 'Audio';
            else if (index < 20) catName = 'Wearables';
            else if (index < 30) catName = 'Smartphones';
            else if (index < 40) catName = 'Displays';

            newProducts.push({
                name: p.name,
                description: p.desc,
                price: p.price,
                stock: Math.floor(Math.random() * 80) + 10,
                brand: p.brand,
                sku: `REAL-${catName.toUpperCase().substring(0,3)}-${skuCounter++}`,
                category: categories[catName],
                images: [getRandom(p.images)],
                isFeatured: index % 10 < 2 // Feature the first two of each category
            });

            index++;
        }

        await Product.insertMany(newProducts);
        console.log(`Successfully added ${newProducts.length} REAL products to the database!`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedProducts();
