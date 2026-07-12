require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const connectDB = require('./config/db');

connectDB();

const userLaptops = [
  {
    "name": "Apple MacBook Air M4 13-inch",
    "brand": "Apple",
    "image": "https://www.apple.com/v/macbook-air/images/overview/hero/hero_static__c9sislzzicq6_large.jpg",
    "price": 1099,
    "desc": "Supercharged by the new M4 chip. Features a Liquid Retina display and all-day battery life."
  },
  {
    "name": "Apple MacBook Pro 14-inch M4 Pro",
    "brand": "Apple",
    "image": "https://www.apple.com/v/macbook-pro/images/overview/hero/hero_intro_endframe__e6khcva4hkeq_large.jpg",
    "price": 1999,
    "desc": "Mind-blowing pro performance with the M4 Pro chip. Perfect for intense workflows and creative pros."
  },
  {
    "name": "Dell XPS 13",
    "brand": "Dell",
    "image": "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/page/category/laptops/xps/xps-13-9340/laptop-xps-13-9340-category-page-hero.psd",
    "price": 1299,
    "desc": "A premium ultrabook crafted with machined aluminum and carbon fiber, featuring a stunning InfinityEdge display."
  },
  {
    "name": "Dell Inspiron 15",
    "brand": "Dell",
    "image": "https://i.dell.com/is/image/DellContent/content/dam/images/products/laptops-and-2-in-1s/inspiron/inspiron-15-3530/media-gallery/laptop-inspiron-15-3530-gallery-1.psd",
    "price": 649,
    "desc": "Reliable everyday performance and a spacious 15.6-inch screen for all your productivity needs."
  },
  {
    "name": "Dell Alienware m18 R2",
    "brand": "Alienware",
    "image": "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/page/category/laptops/alienware/m18-r2/media-gallery/notebook-alienware-m18-r2-gallery-1.psd",
    "price": 2499,
    "desc": "Uncompromised power with an 18-inch display, designed to replace your desktop gaming rig."
  },
  {
    "name": "HP Spectre x360 14",
    "brand": "HP",
    "image": "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08479973.png",
    "price": 1399,
    "desc": "A versatile 2-in-1 convertible with a premium gem-cut design and vibrant OLED touch display."
  },
  {
    "name": "HP Envy x360 15",
    "brand": "HP",
    "image": "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08144534.png",
    "price": 999,
    "desc": "Power and flexibility combine in this 15-inch convertible laptop, great for creators on the go."
  },
  {
    "name": "HP Victus 15",
    "brand": "HP",
    "image": "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08174179.png",
    "price": 849,
    "desc": "Accessible gaming performance packed into a sleek and modern chassis."
  },
  {
    "name": "Lenovo ThinkPad X1 Carbon Gen 12",
    "brand": "Lenovo",
    "image": "https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8MzQ4MjQ5fGltYWdlL3BuZ3xoMzMvaDQ1LzE2MjMwNjY3MTMwOTEwLnBuZw",
    "price": 1799,
    "desc": "The ultimate business laptop. Ultralight carbon fiber construction with legendary keyboard and security."
  },
  {
    "name": "Lenovo Yoga Pro 9i",
    "brand": "Lenovo",
    "image": "https://p2-ofp.static.pub/fes/cms/2024/03/18/xj9d4b8rjv4a7b9n8x3g2gk4v5w0x1.png",
    "price": 1699,
    "desc": "Designed for demanding creators, featuring dedicated graphics and a stunning Mini-LED display."
  },
  {
    "name": "Lenovo LOQ 15",
    "brand": "Lenovo",
    "image": "https://p1-ofp.static.pub/ShareResource/na/products/loq/hero/lenovo-loq-15irh8.png",
    "price": 899,
    "desc": "Your entry into serious gaming. Features advanced thermals and powerful RTX graphics."
  },
  {
    "name": "ASUS ROG Zephyrus G16",
    "brand": "ASUS",
    "image": "https://dlcdnwebimgs.asus.com/gain/4EBC42E7-2D3D-4F89-A3B5-9A3F4F8D91C2",
    "price": 1999,
    "desc": "Ultra-slim gaming masterpiece featuring an OLED panel and incredibly thin aluminum chassis."
  },
  {
    "name": "ASUS TUF Gaming A15",
    "brand": "ASUS",
    "image": "https://dlcdnwebimgs.asus.com/gain/F71D7F17-75A6-49C2-96A2-40A79E6B4B79",
    "price": 1099,
    "desc": "Military-grade durability meets high framerate gaming in this rugged powerhouse."
  },
  {
    "name": "ASUS Vivobook 15 OLED",
    "brand": "ASUS",
    "image": "https://dlcdnwebimgs.asus.com/gain/1DFFFE53-638D-4A43-A6A4-813A0D5D99E3",
    "price": 799,
    "desc": "Experience true colors with a gorgeous OLED display perfect for everyday entertainment."
  },
  {
    "name": "Acer Aspire 5",
    "brand": "Acer",
    "image": "https://static-ecapac.acer.com/media/catalog/product/cache/9/image/800x600/040ec09b1e35df139433887a97daa66f/a/s/aspire5-a515-58m-black.png",
    "price": 549,
    "desc": "A budget-friendly performer that handles all your daily tasks with ease."
  },
  {
    "name": "Acer Swift Go 14",
    "brand": "Acer",
    "image": "https://static-ecapac.acer.com/media/catalog/product/cache/9/image/800x600/s/w/swift-go-14.png",
    "price": 899,
    "desc": "An ultra-portable laptop that balances performance and battery life for students and professionals."
  },
  {
    "name": "Acer Predator Helios Neo 16",
    "brand": "Acer",
    "image": "https://static-ecapac.acer.com/media/catalog/product/cache/9/image/800x600/p/r/predator-helios-neo-16.png",
    "price": 1499,
    "desc": "Desktop-caliber gaming performance in a laptop form factor with a brilliant 16-inch screen."
  },
  {
    "name": "MSI Stealth 16 AI Studio",
    "brand": "MSI",
    "image": "https://storage-asset.msi.com/global/picture/image/feature/nb/Stealth/Stealth16AIStudioA1V/images/kv.png",
    "price": 2199,
    "desc": "A slim, sharp, and stealthy creator laptop packed with AI-powered RTX graphics."
  },
  {
    "name": "MSI Katana 15",
    "brand": "MSI",
    "image": "https://storage-asset.msi.com/global/picture/image/feature/nb/Katana15B13V/images/kv.png",
    "price": 1199,
    "desc": "Sharpen your game. A dedicated gaming laptop with a fast refresh rate display."
  },
  {
    "name": "Razer Blade 16",
    "brand": "Razer",
    "image": "https://assets2.razerzone.com/images/pnx.assets/razer-blade-16.png",
    "price": 2999,
    "desc": "The pinnacle of gaming laptops. Features a dual-mode Mini-LED display and premium CNC aluminum body."
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

        for (const p of userLaptops) {
            newProducts.push({
                name: p.name,
                description: p.desc,
                price: p.price,
                stock: Math.floor(Math.random() * 50) + 10,
                brand: p.brand,
                sku: `LAPTOP-${skuCounter++}`,
                category: cat._id,
                images: [p.image],
                isFeatured: index < 4 // Feature the first four laptops on the home page
            });
            index++;
        }

        await Product.insertMany(newProducts);
        console.log(`Successfully added ${newProducts.length} USER-PROVIDED LAPTOPS to the database!`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedProducts();
