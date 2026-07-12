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

const userLaptops = [
  {
    "name": "Apple MacBook Air M4 13-inch",
    "image": "https://www.apple.com/v/macbook-air/images/overview/hero/hero_static__c9sislzzicq6_large.jpg"
  },
  {
    "name": "Apple MacBook Pro 14-inch M4 Pro",
    "image": "https://www.apple.com/v/macbook-pro/images/overview/hero/hero_intro_endframe__e6khcva4hkeq_large.jpg"
  },
  {
    "name": "Dell XPS 13",
    "image": "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/page/category/laptops/xps/xps-13-9340/laptop-xps-13-9340-category-page-hero.psd"
  },
  {
    "name": "Dell Inspiron 15",
    "image": "https://i.dell.com/is/image/DellContent/content/dam/images/products/laptops-and-2-in-1s/inspiron/inspiron-15-3530/media-gallery/laptop-inspiron-15-3530-gallery-1.psd"
  },
  {
    "name": "Dell Alienware m18 R2",
    "image": "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/page/category/laptops/alienware/m18-r2/media-gallery/notebook-alienware-m18-r2-gallery-1.psd"
  },
  {
    "name": "HP Spectre x360 14",
    "image": "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08479973.png"
  },
  {
    "name": "HP Envy x360 15",
    "image": "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08144534.png"
  },
  {
    "name": "HP Victus 15",
    "image": "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08174179.png"
  },
  {
    "name": "Lenovo ThinkPad X1 Carbon Gen 12",
    "image": "https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8MzQ4MjQ5fGltYWdlL3BuZ3xoMzMvaDQ1LzE2MjMwNjY3MTMwOTEwLnBuZw"
  },
  {
    "name": "Lenovo Yoga Pro 9i",
    "image": "https://p2-ofp.static.pub/fes/cms/2024/03/18/xj9d4b8rjv4a7b9n8x3g2gk4v5w0x1.png"
  },
  {
    "name": "Lenovo LOQ 15",
    "image": "https://p1-ofp.static.pub/ShareResource/na/products/loq/hero/lenovo-loq-15irh8.png"
  },
  {
    "name": "ASUS ROG Zephyrus G16",
    "image": "https://dlcdnwebimgs.asus.com/gain/4EBC42E7-2D3D-4F89-A3B5-9A3F4F8D91C2"
  },
  {
    "name": "ASUS TUF Gaming A15",
    "image": "https://dlcdnwebimgs.asus.com/gain/F71D7F17-75A6-49C2-96A2-40A79E6B4B79"
  },
  {
    "name": "ASUS Vivobook 15 OLED",
    "image": "https://dlcdnwebimgs.asus.com/gain/1DFFFE53-638D-4A43-A6A4-813A0D5D99E3"
  },
  {
    "name": "Acer Aspire 5",
    "image": "https://static-ecapac.acer.com/media/catalog/product/cache/9/image/800x600/040ec09b1e35df139433887a97daa66f/a/s/aspire5-a515-58m-black.png"
  },
  {
    "name": "Acer Swift Go 14",
    "image": "https://static-ecapac.acer.com/media/catalog/product/cache/9/image/800x600/s/w/swift-go-14.png"
  },
  {
    "name": "Acer Predator Helios Neo 16",
    "image": "https://static-ecapac.acer.com/media/catalog/product/cache/9/image/800x600/p/r/predator-helios-neo-16.png"
  },
  {
    "name": "MSI Stealth 16 AI Studio",
    "image": "https://storage-asset.msi.com/global/picture/image/feature/nb/Stealth/Stealth16AIStudioA1V/images/kv.png"
  },
  {
    "name": "MSI Katana 15",
    "image": "https://storage-asset.msi.com/global/picture/image/feature/nb/Katana15B13V/images/kv.png"
  },
  {
    "name": "Razer Blade 16",
    "image": "https://assets2.razerzone.com/images/pnx.assets/razer-blade-16.png"
  }
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Referer': 'https://www.google.com/'
            }
        };

        client.get(url, options, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 308) {
                return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to download image. Status code: ${res.statusCode} for URL: ${url}`));
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
            const laptopInfo = userLaptops.find(l => l.name === product.name);
            if (laptopInfo) {
                let ext = path.extname(new URL(laptopInfo.image).pathname) || '.jpg';
                if (ext === '.psd') ext = '.png'; // Some Dell URLs end in .psd but serve images
                const filename = `laptop-${product._id}${ext}`;
                const filepath = path.join(laptopsDir, filename);
                
                try {
                    await downloadImage(laptopInfo.image, filepath);
                    console.log(`Downloaded image for ${product.name}`);
                    product.images = [`/images/laptops/${filename}`];
                    await product.save();
                } catch (err) {
                    console.error(`Error downloading for ${product.name}: ${err.message}`);
                    product.images = ['https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800'];
                    await product.save();
                }
            }
        }
        console.log("Database updated with local images!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

updateDB();
