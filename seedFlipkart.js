require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const connectDB = require('./config/db');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

connectDB();

const laptopsDir = path.join(__dirname, 'public', 'images', 'laptops');
if (!fs.existsSync(laptopsDir)) {
    fs.mkdirSync(laptopsDir, { recursive: true });
}

const flipkartProducts = [
  {
    name: "Asus ROG Strix G15",
    brand: "Asus",
    desc: "A powerful gaming laptop featuring advanced cooling, a high-refresh-rate display, and an aggressive esports-ready design.",
    price: 1299,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/k/t/y/-enriched-transparent-original-imahg53xspmfrsdd.png?q=90"
  },
  {
    name: "Lenovo IdeaPad Gaming 3",
    brand: "Lenovo",
    desc: "Elevate your game with this sleek, stealthy gaming laptop packing discrete graphics and a responsive keyboard.",
    price: 899,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/h/p/x/-original-imah2ger8fwg9raw.jpeg?q=90"
  },
  {
    name: "HP Pavilion 14",
    brand: "HP",
    desc: "A versatile, everyday laptop that perfectly balances performance and portability for students and professionals.",
    price: 649,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/u/b/b/-original-imahnvpbk9usvxky.jpeg?q=90"
  },
  {
    name: "Dell Inspiron 15 3000",
    brand: "Dell",
    desc: "Reliable performance for daily tasks, featuring a spacious 15.6-inch screen and a durable, textured chassis.",
    price: 549,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/o/9/k/-original-imahgry8nwkejmae.jpeg?q=90"
  },
  {
    name: "Acer Nitro 5",
    brand: "Acer",
    desc: "Dominate the battlefield with this striking black and red gaming laptop, offering superior cooling and immersive audio.",
    price: 999,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/1/w/1/-original-imahm953tmrkq8rs.jpeg?q=90"
  },
  {
    name: "MSI GF63 Thin",
    brand: "MSI",
    desc: "A brushed-aluminum gaming laptop that proves you don't need a bulky chassis to deliver serious gaming frame rates.",
    price: 799,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/l/m/p/-original-imahfcztkcgtkkzq.jpeg?q=90"
  },
  {
    name: "Lenovo ThinkBook 15",
    brand: "Lenovo",
    desc: "Designed for modern businesses, offering robust security features, a sleek mineral gray finish, and extensive connectivity.",
    price: 849,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/d/s/x/-original-imahg5ftu2dzvyu8.jpeg?q=90"
  },
  {
    name: "HP Omen 16",
    brand: "HP",
    desc: "A premium gaming powerhouse with a minimalist design, desktop-caliber graphics, and an ultra-fast display.",
    price: 1499,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/c/z/r/-original-imahmktfmsywyjd6.jpeg?q=90"
  },
  {
    name: "Asus Zenbook 14",
    brand: "Asus",
    desc: "An incredibly compact, ultra-light premium laptop featuring the signature spun-metal finish and an edge-to-edge display.",
    price: 1099,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/d/z/z/-enriched-transparent-original-imahgfdfx3hhguyc.png?q=90"
  },
  {
    name: "Acer Swift 3",
    brand: "Acer",
    desc: "A brilliant, all-metal ultrabook that brings long battery life and snappy performance to your everyday commute.",
    price: 749,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/g/4/k/-original-imahfn3geekjdudx.jpeg?q=90"
  },
  {
    name: "Dell XPS 15",
    brand: "Dell",
    desc: "A stunning piece of engineering with an InfinityEdge display, carbon fiber palm rest, and creator-grade performance.",
    price: 1699,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/2/o/d/-original-imahg5fxrynh3hnw.jpeg?q=90"
  }
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            }
        };

        client.get(url, options, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 308) {
                return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to download image. Status code: ${res.statusCode}`));
            }

            const file = fs.createWriteStream(filepath);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
            file.on('error', (err) => {
                fs.unlink(filepath, () => {});
                reject(err);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
};

const runSeed = async () => {
    try {
        let cat = await Category.findOne({ name: 'Laptops' });
        if (!cat) cat = await Category.create({ name: 'Laptops', slug: 'laptops' });

        const newProducts = [];
        let skuCounter = 500; // Start high to avoid conflicts
        let index = 0;

        for (const p of flipkartProducts) {
            const product = new Product({
                name: p.name,
                description: p.desc,
                price: p.price,
                stock: Math.floor(Math.random() * 30) + 5,
                brand: p.brand,
                sku: `LAPTOP-FLIP-${skuCounter++}`,
                category: cat._id,
                images: [],
                isFeatured: index < 3
            });

            // We download the image locally to ensure it displays correctly
            let ext = path.extname(new URL(p.image).pathname) || '.jpg';
            const filename = `laptop-flipkart-${skuCounter}${ext}`;
            const filepath = path.join(laptopsDir, filename);

            try {
                console.log(`Downloading ${p.name} image...`);
                await downloadImage(p.image, filepath);
                product.images = [`/images/laptops/${filename}`];
            } catch (err) {
                console.error(`Failed to download ${p.name}: ${err.message}. Using URL directly.`);
                product.images = [p.image];
            }

            await product.save();
            newProducts.push(product);
            index++;
        }

        console.log(`Successfully added ${newProducts.length} new Flipkart laptop products to the database!`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

runSeed();
