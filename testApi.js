const http = require('http');

const testEndpoint = (path) => {
    return new Promise((resolve) => {
        http.get(`http://localhost:3000${path}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`\n--- ${path} ---`);
                console.log(`Status: ${res.statusCode}`);
                console.log(`Response: ${data.substring(0, 300)}`);
                resolve();
            });
        }).on('error', (err) => {
            console.log(`\n--- ${path} ---`);
            console.log(`Error: ${err.message}`);
            resolve();
        });
    });
};

const run = async () => {
    await testEndpoint('/api/products?featured=true&limit=5');
    await testEndpoint('/api/products/meta/facets');
};

run();
