require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');
const Tesseract = require('tesseract.js');
const path = require('path');

connectDB();

const runOCR = async () => {
    try {
        const products = await Product.find({ sku: { $regex: 'LAPTOP-FLIP', $options: 'i' } });
        console.log(`Found ${products.length} Flipkart laptops to scan.`);

        for (const product of products) {
            const imgPath = product.images[0];
            const fullPath = path.join(__dirname, 'public', imgPath);
            
            console.log(`\nScanning: ${product.name} (ID: ${product._id})`);
            console.log(`Image: ${imgPath}`);
            
            try {
                const result = await Tesseract.recognize(
                    fullPath,
                    'eng',
                    { logger: m => {} } // silence logging
                );
                const text = result.data.text.trim().replace(/\n/g, ' | ');
                console.log(`OCR TEXT: ${text}`);
            } catch (err) {
                console.error(`OCR failed for ${product.name}:`, err.message);
            }
        }
        
        console.log("\nFinished OCR scan.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
runOCR();
