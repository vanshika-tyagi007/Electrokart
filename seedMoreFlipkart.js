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

const newFlipkartProducts = [
  {
    name: "Samsung Galaxy Book4",
    brand: "Samsung",
    desc: "An incredibly thin and light laptop with an AMOLED display, perfect for creatives and professionals on the move.",
    price: 1199,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/z/t/g/-original-imahmazj9jdvdzeb.jpeg?q=90"
  },
  {
    name: "Asus ROG Zephyrus G14",
    brand: "Asus",
    desc: "The ultimate 14-inch gaming laptop. Packs an incredible punch in an ultra-portable chassis with a stunning display.",
    price: 1499,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/3/y/s/-original-imahhw5xygnfm36g.jpeg?q=90"
  },
  {
    name: "LG Gram 17",
    brand: "LG",
    desc: "A massive 17-inch screen housed in a ridiculously lightweight body, offering all-day battery life.",
    price: 1399,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/f/6/r/-original-imahg53uvtcffmvf.jpeg?q=90"
  },
  {
    name: "Acer Chromebook Spin 714",
    brand: "Acer",
    desc: "A premium 2-in-1 Chromebook with a garaged stylus, fast Intel performance, and a robust aluminum chassis.",
    price: 699,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/r/7/u/-original-imahmpquxzztyzny.jpeg?q=90"
  },
  {
    name: "Gigabyte AORUS 15",
    brand: "Gigabyte",
    desc: "Precision engineering meets high-end gaming. Features a windforce cooling system and blazing fast refresh rates.",
    price: 1599,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/g/e/w/-original-imahfn3g7wwtjxjb.jpeg?q=90"
  },
  {
    name: "Microsoft Surface Laptop 6",
    brand: "Microsoft",
    desc: "Sleek, elegant, and powerful. Features a vibrant PixelSense touchscreen and premium Alcantara or metal finish.",
    price: 999,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/e/v/o/-original-imahfustt8hwcnkb.jpeg?q=90"
  },
  {
    name: "HP EliteBook 840 G10",
    brand: "HP",
    desc: "The pinnacle of business productivity, featuring advanced security, AI noise reduction, and a crisp display.",
    price: 1299,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/h/x/n/-original-imahfskhwd2rvnuh.jpeg?q=90"
  },
  {
    name: "Lenovo Legion Pro 5i",
    brand: "Lenovo",
    desc: "A serious gaming machine boasting AI-tuned performance, superior thermals, and an esports-ready screen.",
    price: 1699,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/u/e/9/-original-imahzvfcsqpynrcd.jpeg?q=90"
  },
  {
    name: "Microsoft Surface Laptop Go 3",
    brand: "Microsoft",
    desc: "The lightest Surface Laptop yet. Features a brilliant 12.4-inch touchscreen and premium typing experience.",
    price: 799, // Duplicate image URL used here
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/e/v/o/-original-imahfustt8hwcnkb.jpeg?q=90"
  },
  {
    name: "Dell Latitude 5540",
    brand: "Dell",
    desc: "Built for work from anywhere. Offers intelligent performance, extended battery, and eco-friendly design.",
    price: 1099,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/e/8/9/-enriched-transparent-original-imahgx8w63f8shx4.png?q=90"
  },
  {
    name: "MSI Titan GT77",
    brand: "MSI",
    desc: "The desktop replacement king. Features extreme power, a mechanical keyboard, and a breathtaking 4K display.",
    price: 3499,
    image: "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/t/v/1/-original-imahndkuxqnmrcft.jpeg?q=90"
  }
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
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
        let skuCounter = 600; // Using 600 to avoid conflicts with previous batches
        let index = 0;

        for (const p of newFlipkartProducts) {
            const product = new Product({
                name: p.name,
                description: p.desc,
                price: p.price,
                stock: Math.floor(Math.random() * 25) + 5,
                brand: p.brand,
                sku: `LAPTOP-FLIP-MORE-${skuCounter++}`,
                category: cat._id,
                images: [],
                isFeatured: false 
            });

            // Download image locally
            let ext = path.extname(new URL(p.image).pathname) || '.jpg';
            const filename = `laptop-flipkart-more-${skuCounter}${ext}`;
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

        console.log(`Successfully added ${newProducts.length} MORE Flipkart laptop products to the database!`);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

runSeed();
