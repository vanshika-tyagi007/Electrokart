require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
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

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
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

const updateDB = async () => {
    try {
        const products = await Product.find({});
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const imageUrl = product.images[0];
            
            // Only process URLs that are external (http/https)
            if (imageUrl && imageUrl.startsWith('http')) {
                const filename = `laptop-${product._id}.jpg`;
                const filepath = path.join(laptopsDir, filename);
                
                try {
                    console.log(`Downloading image for: ${product.name}...`);
                    await downloadImage(imageUrl, filepath);
                    product.images = [`/images/laptops/${filename}`];
                    await product.save();
                    console.log(`Successfully downloaded and updated ${product.name}`);
                } catch (err) {
                    console.error(`Error downloading for ${product.name}: ${err.message}`);
                }
            } else {
                console.log(`Skipping ${product.name}, already uses a local image.`);
            }
        }
        console.log("Finished downloading external images to local storage!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

updateDB();
