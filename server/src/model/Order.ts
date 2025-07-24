import mongoose from "mongoose";

interface IOrder{
    consumer: Object,
    seller: Object,
    product: Object,
    status: string,
    paymentMethod: string,
    quantity: Number,
}

const OrderSchema = new mongoose.Schema({
    consumer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    status:{
        type: String,
        enum: ["pending", "delivered"],
        default: "pending",
        required: true
    },
    paymentMethod:{
        type: String,
        enum: ["Online", "COD"],
        default: "COD",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, {timestamps: true});

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;