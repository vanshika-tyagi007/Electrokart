require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const connectDB = require('./config/db');

connectDB();

const laptops = [
    // APPLE (MacBooks)
    { 
        brand: 'Apple', name: 'MacBook Air M3 (13-inch)', price: 1099.00, 
        desc: 'Supercharged by M3, the MacBook Air features a stunning Liquid Retina display, an incredibly thin and light design, and up to 18 hours of battery life.', 
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'] 
    },
    { 
        brand: 'Apple', name: 'MacBook Air M3 (15-inch)', price: 1299.00, 
        desc: 'The 15-inch MacBook Air gives you more room to work and play. Powered by the incredibly fast M3 chip for exceptional performance.', 
        images: ['https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800'] 
    },
    { 
        brand: 'Apple', name: 'MacBook Pro 14" (M3 Pro)', price: 1999.00, 
        desc: 'Mind-blowing pro performance. Features the M3 Pro chip, a beautiful Liquid Retina XDR display, and all the ports you need.', 
        images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'] 
    },
    { 
        brand: 'Apple', name: 'MacBook Pro 16" (M3 Max)', price: 3499.00, 
        desc: 'The ultimate pro machine. Powered by the M3 Max chip with 128GB of unified memory. Designed for rendering, compiling, and extreme multitasking.', 
        images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800'] 
    },
    { 
        brand: 'Apple', name: 'MacBook Pro 13" (M2)', price: 1299.00, 
        desc: 'The classic Pro design with the Touch Bar, supercharged by the Apple M2 chip. Features active cooling for sustained performance.', 
        images: ['https://images.unsplash.com/photo-1515562141207-7a88cb7ce338?w=800'] 
    },

    // DELL
    { 
        brand: 'Dell', name: 'Dell XPS 13 Plus', price: 1299.00, 
        desc: 'A minimalist masterpiece. Features a seamless glass touchpad, a zero-lattice keyboard, and a stunning 13.4-inch OLED display.', 
        images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'] 
    },
    { 
        brand: 'Dell', name: 'Dell XPS 15', price: 1499.00, 
        desc: 'The perfect balance of power and portability. Packed with an Intel Core i7 and NVIDIA RTX 4050 for creators on the go.', 
        images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'] 
    },
    { 
        brand: 'Dell', name: 'Dell XPS 17', price: 2199.00, 
        desc: 'Colossal power in a sleek chassis. Experience incredible performance for video editing and 3D rendering with a massive 17-inch display.', 
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'] 
    },
    { 
        brand: 'Dell', name: 'Alienware m16 R2', price: 1699.00, 
        desc: 'Uncompromised gaming performance. Featuring a stealth mode, QHD+ 240Hz display, and NVIDIA RTX 4070 graphics.', 
        images: ['https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800'] 
    },
    { 
        brand: 'Dell', name: 'Dell Inspiron 14 Plus', price: 899.00, 
        desc: 'Your daily driver elevated. Reliable performance, all-day battery life, and a crisp 14-inch display in a lightweight aluminum body.', 
        images: ['https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=800'] 
    },

    // HP
    { 
        brand: 'HP', name: 'HP Spectre x360 14', price: 1449.00, 
        desc: 'A gorgeous 2-in-1 convertible. Features a 3K OLED touch display, premium gem-cut design, and an included stylus for drawing.', 
        images: ['https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=800'] 
    },
    { 
        brand: 'HP', name: 'HP Envy x360 15', price: 999.00, 
        desc: 'Versatile and powerful. A 15-inch convertible laptop that gives you the freedom to create, connect, and collaborate anywhere.', 
        images: ['https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=800'] 
    },
    { 
        brand: 'HP', name: 'HP Omen Transcend 14', price: 1499.00, 
        desc: 'The lightest 14-inch gaming laptop in the world. Enjoy immersive gaming on an OLED display with Intel Core Ultra processors.', 
        images: ['https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=800'] 
    },
    { 
        brand: 'HP', name: 'HP Dragonfly G4', price: 1699.00, 
        desc: 'The ultimate premium business laptop. Ultra-light at under 1kg, featuring a 5MP webcam, AI noise reduction, and enterprise security.', 
        images: ['https://images.unsplash.com/photo-1504707748692-419802cf939d?w=800'] 
    },

    // LENOVO
    { 
        brand: 'Lenovo', name: 'ThinkPad X1 Carbon Gen 12', price: 1799.00, 
        desc: 'The legendary business laptop gets an Intel Core Ultra upgrade. Impossibly thin, incredibly tough carbon fiber chassis.', 
        images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'] 
    },
    { 
        brand: 'Lenovo', name: 'Lenovo Yoga 9i', price: 1399.00, 
        desc: 'Luxury and performance combined. Features a rotating soundbar by Bowers & Wilkins and a stunning 4K OLED touchscreen.', 
        images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'] 
    },
    { 
        brand: 'Lenovo', name: 'Legion Pro 7i Gen 9', price: 2199.00, 
        desc: 'Esports-ready gaming. Packed with an Intel Core i9, RTX 4080, and the Legion Coldfront 5.0 advanced cooling system.', 
        images: ['https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800'] 
    },
    { 
        brand: 'Lenovo', name: 'IdeaPad Slim 7', price: 849.00, 
        desc: 'Slim, sleek, and exceptionally portable. Powered by AMD Ryzen 7 processors for quick multitasking and long battery life.', 
        images: ['https://images.unsplash.com/photo-1544281143-6c8fb735f470?w=800'] 
    },

    // ASUS
    { 
        brand: 'Asus', name: 'ROG Zephyrus G14', price: 1599.00, 
        desc: 'A masterclass in ultra-portable gaming. Features an OLED display, CNC-milled aluminum chassis, and the iconic Slash Lighting.', 
        images: ['https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=800'] 
    },
    { 
        brand: 'Asus', name: 'Zenbook 14 OLED', price: 1049.00, 
        desc: 'Premium elegance. A slim 1.2kg body housing an Intel Core Ultra processor and an eye-care certified 3K OLED screen.', 
        images: ['https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=800'] 
    },
    { 
        brand: 'Asus', name: 'ProArt Studiobook 16', price: 2499.00, 
        desc: 'Designed for creative professionals. Features the ASUS Dial for precise control in creative apps and a color-accurate 4K OLED display.', 
        images: ['https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=800'] 
    },

    // MICROSOFT
    { 
        brand: 'Microsoft', name: 'Surface Laptop 6 for Business', price: 1199.00, 
        desc: 'PixelSense touchscreen, exceptional typing experience, and all-day battery life. The perfect thin and light Windows 11 machine.', 
        images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'] 
    },
    { 
        brand: 'Microsoft', name: 'Surface Pro 10', price: 1299.00, 
        desc: 'The most versatile 2-in-1. Transition from a full laptop to a portable tablet with the iconic built-in Kickstand and detachable keyboard.', 
        images: ['https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=800'] 
    },

    // RAZER
    { 
        brand: 'Razer', name: 'Razer Blade 16', price: 2999.00, 
        desc: 'The world’s first dual-mode mini-LED display. Seamlessly switch between 4K 120Hz for creation and FHD+ 240Hz for gaming.', 
        images: ['https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800'] 
    },

    // ACER
    { 
        brand: 'Acer', name: 'Predator Helios 16', price: 1699.00, 
        desc: 'Unleash extreme gaming performance with a WQXGA 240Hz Mini-LED display and advanced 5th Gen AeroBlade 3D fan technology.', 
        images: ['https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800'] 
    }
];

const seedProducts = async () => {
    try {
        await Product.deleteMany({}); // Clear all products to start fresh
        
        let cat = await Category.findOne({ name: 'Laptops' });
        if (!cat) cat = await Category.create({ name: 'Laptops', slug: 'laptops' });

        const newProducts = [];
        let skuCounter = 1;
        let index = 0;

        for (const p of laptops) {
            newProducts.push({
                name: p.name,
                description: p.desc,
                price: p.price,
                stock: Math.floor(Math.random() * 80) + 10,
                brand: p.brand,
                sku: `LAP-${skuCounter++}`,
                category: cat._id,
                images: p.images,
                isFeatured: index < 4 // Feature the first four laptops
            });
            index++;
        }

        await Product.insertMany(newProducts);
        console.log(`Successfully added ${newProducts.length} LAPTOP products to the database!`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedProducts();
