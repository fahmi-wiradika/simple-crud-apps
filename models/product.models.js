const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter product name"],
        },
        quantity: {
            type: Number,
            required: true,
            default: 0,
            min: [0, "Quantity cannot be negative"]
        },
        price: {
            type: Number,
            required: true,
            default: 0,
            min: [0, "Price cannot be negative"]
        },
        Image: {
            type: String,
            required: false
        },
    },
    {
        timestamps: true
    }
);


const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;