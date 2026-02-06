const Product = require("../models/product.models.js");

// get all products - sorted by newest first
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// get single product
const getSingleProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(200).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// create a product
const createProducts = async (req, res) => {
    try {
        // Validate non-negative values
        if (req.body.price !== undefined && req.body.price < 0) {
            return res.status(400).json({ message: "Price cannot be negative" });
        }
        if (req.body.quantity !== undefined && req.body.quantity < 0) {
            return res.status(400).json({ message: "Quantity cannot be negative" });
        }
        
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update a product
const updateProducts = async (req, res) => {
    try {
        // Validate non-negative values
        if (req.body.price !== undefined && req.body.price < 0) {
            return res.status(400).json({ message: "Price cannot be negative" });
        }
        if (req.body.quantity !== undefined && req.body.quantity < 0) {
            return res.status(400).json({ message: "Quantity cannot be negative" });
        }

        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// delete a product
const deleteProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        else {
            res.status(200).json({ message: "Product deleted successfully" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// export function
module.exports = {
    getProducts,
    getSingleProducts,
    createProducts,
    updateProducts,
    deleteProducts
}