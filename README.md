# Electrokart

A complete production-ready full-stack e-commerce application built strictly using Node.js, Express, MongoDB, EJS, HTML, CSS, and Vanilla JavaScript. 

The UI exactly mimics the premium design of the reference website, replacing placeholder functionality with a secure, real-time backend.

## Project Overview

Electrokart is an immersive e-commerce platform offering premium electronics. The platform is designed with an emphasis on visual aesthetics, featuring sleek dark modes, micro-animations, and seamless user experiences.

## Features

- **User Authentication**: Secure registration and login using bcrypt and JSON Web Tokens (JWT) stored in HTTP-only cookies.
- **Role-Based Access**: Specialized views and capabilities based on roles (User vs. Admin).
- **Product Management**: Full CRUD capabilities for products and categories via the Admin dashboard.
- **Shopping Cart & Wishlist**: Persistent cart and wishlist tied to user accounts in MongoDB.
- **Dummy Checkout Flow**: Allows users to input shipping details and mock payment to place an order, correctly updating inventory levels.
- **Admin Dashboard**: Analytics on products, orders, users, and revenue, plus inventory and order management.
- **Responsive UI**: Pixel-perfect implementation matching the reference site, fully responsive across desktop, tablet, and mobile.
- **Robust Security**: Protected with `helmet`, `cors`, `express-rate-limit`, and data validation with `express-validator`.

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JS (ES6+), EJS Templates
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT, bcrypt
- **File Uploads**: Multer (Local Storage)

## Installation Steps

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/your-username/electrokart.git
   cd electrokart
   \`\`\`

2. **Install Dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure Environment Variables:**
   Update the \`.env\` file in the root directory:
   \`\`\`env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/electrokart
   JWT_SECRET=your_jwt_secret_key
   \`\`\`

4. **MongoDB Setup:**
   Ensure you have [MongoDB installed](https://www.mongodb.com/docs/manual/installation/) and running locally, or replace \`MONGODB_URI\` with a MongoDB Atlas connection string.

5. **Seed Database (Optional):**
   To populate the database with initial products, categories, and an admin user (email: \`admin@electrokart.com\`, password: \`password123\`), run:
   \`\`\`bash
   node seed.js
   \`\`\`

6. **Start the Application:**
   \`\`\`bash
   npm start
   # Or for development: npm run dev (if nodemon is installed)
   node app.js
   \`\`\`

7. **Access the Application:**
   Navigate to \`http://localhost:3000\` in your browser.

## Folder Structure

\`\`\`
electrokart/
├── config/            # DB configuration
├── controllers/       # Route logic
├── middleware/        # Auth, Validation, Uploads
├── models/            # Mongoose schemas
├── public/            # Static assets (css, js, images)
├── routes/            # Express routers
├── utils/             # Helper functions
├── views/             # EJS templates (pages & partials)
├── uploads/           # Multer local image storage
├── .env               # Environment configuration
├── app.js             # Express application entry point
├── package.json       # Project dependencies
└── seed.js            # DB seeding script
\`\`\`

## Future Improvements
- Integrate real payment gateways (Stripe/PayPal).
- Add Cloudinary support for remote image uploads.
- Implement real-time email notifications for orders.
- Expand admin analytics with graphical charts.
