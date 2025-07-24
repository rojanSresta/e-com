import mongoose from "mongoose";
import { ref } from "process";

export interface IProduct{
    productName: string,
    price: Number,
    productPic?: string,
    description?: string,
    category: string,
    stockAmount: Number,
}

const productSchema = new mongoose.Schema({
    productName:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productPic:{
        type: String,
        default: "https://img.freepik.com/premium-vector/new-product-stamp-sign-symbol-new-product-text-written-red-stamp_690577-3823.jpg"
    },
    description:{
        type: String,
        default: "This is a sample description for the above product.",
    },
    category: {
        type: String,
        enum: ["Electronic Accessories", "Sports & Outdoor", "Men's Fashion", "Women's Fashion", "Babies & Toys", "Home & Lifestyle"],
        required: true
    },
    stockAmount:{
        type: Number,
        required: true,
        default: 0
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;