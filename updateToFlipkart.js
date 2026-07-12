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

// Map the specific laptops to the relevant Flipkart URLs provided by the user
const flipkartMap = {
    "Dell XPS 13": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/2/o/d/-original-imahg5fxrynh3hnw.jpeg?q=90",
    "Dell Inspiron 15": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/o/9/k/-original-imahgry8nwkejmae.jpeg?q=90",
    "HP Envy x360 15": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/u/b/b/-original-imahnvpbk9usvxky.jpeg?q=90",
    "HP Victus 15": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/c/z/r/-original-imahmktfmsywyjd6.jpeg?q=90",
    "Lenovo ThinkPad X1 Carbon Gen 12": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/d/s/x/-original-imahg5ftu2dzvyu8.jpeg?q=90",
    "Lenovo LOQ 15": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/h/p/x/-original-imah2ger8fwg9raw.jpeg?q=90",
    "ASUS ROG Zephyrus G16": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/k/t/y/-enriched-transparent-original-imahg53xspmfrsdd.png?q=90",
    "ASUS Vivobook 15 OLED": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/d/z/z/-enriched-transparent-original-imahgfdfx3hhguyc.png?q=90",
    "Acer Aspire 5": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/g/4/k/-original-imahfn3geekjdudx.jpeg?q=90",
    "Acer Predator Helios Neo 16": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/1/w/1/-original-imahm953tmrkq8rs.jpeg?q=90",
    "MSI Katana 15": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/l/m/p/-original-imahfcztkcgtkkzq.jpeg?q=90",
    "MSI Stealth 16 AI Studio": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/l/m/p/-original-imahfcztkcgtkkzq.jpeg?q=90",
    "Dell Alienware m18 R2": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/k/t/y/-enriched-transparent-original-imahg53xspmfrsdd.png?q=90",
    "HP Spectre x360 14": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/d/z/z/-enriched-transparent-original-imahgfdfx3hhguyc.png?q=90",
    "Lenovo Yoga Pro 9i": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/d/s/x/-original-imahg5ftu2dzvyu8.jpeg?q=90",
    "ASUS TUF Gaming A15": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/1/w/1/-original-imahm953tmrkq8rs.jpeg?q=90",
    "Acer Swift Go 14": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/g/4/k/-original-imahfn3geekjdudx.jpeg?q=90",
    "Razer Blade 16": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/c/z/r/-original-imahmktfmsywyjd6.jpeg?q=90",
    // We will use the sleek Dell XPS image for the MacBooks since Flipkart doesn't have MacBook URLs provided
    "Apple MacBook Air M4 13-inch": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/2/o/d/-original-imahg5fxrynh3hnw.jpeg?q=90",
    "Apple MacBook Pro 14-inch M4 Pro": "https://rukminim2.flixcart.com/image/1280/1280/xif0q/computer/2/o/d/-original-imahg5fxrynh3hnw.jpeg?q=90"
};

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
        // Delete the extra products I accidentally created previously
        await Product.deleteMany({ sku: { $regex: /^LAPTOP-FLIP-/ } });
        console.log("Cleaned up extra products.");

        // Update the actual 20 user laptops
        const products = await Product.find({});
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const flipkartUrl = flipkartMap[product.name];
            
            if (flipkartUrl) {
                let ext = path.extname(new URL(flipkartUrl).pathname) || '.jpg';
                const filename = `laptop-flipkart-${product._id}${ext}`;
                const filepath = path.join(laptopsDir, filename);
                
                try {
                    console.log(`Downloading Flipkart image for: ${product.name}...`);
                    await downloadImage(flipkartUrl, filepath);
                    product.images = [`/images/laptops/${filename}`];
                    await product.save();
                    console.log(`Successfully downloaded and updated ${product.name}`);
                } catch (err) {
                    console.error(`Error downloading for ${product.name}: ${err.message}`);
                    product.images = [flipkartUrl]; // Use direct URL as fallback
                    await product.save();
                }
            }
        }
        console.log("Finished updating main products with relevant Flipkart images!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

updateDB();
