// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const productRoute = require('./routes/product.route.js');

// Initiate app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// product routes (must come before static files)
app.use("/api/products", productRoute);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for root route and all non-API routes (SPA fallback)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Setup Connection for MongoDB
const dbMongoURI = process.env.SCA_DB_MONGO_URI;

// Check if environment variables are loaded
if (!dbMongoURI) {
    console.error("Database credentials not found in environment variables");
    process.exit(1);
}

const mongoURI = dbMongoURI;

mongoose.connect(mongoURI)
    .then(() => {
        console.log("Connected to database!");
    })
    .catch((err) => {
        console.log("Connection failed!", err);
    });

// Export for Vercel serverless
module.exports = app;

// Only listen on port in development
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}