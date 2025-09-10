import { Request, Response, NextFunction } from "express";
import User from "../model/User";
import Product from "../model/Product";
import redisClient from "../lib/redisClient";

export async function addProduct(req: Request, res: Response):Promise<any> {
    try{
        const {email, productName, price, image, description, category, stockAmount} = req.body;

        if(!productName || !price || !category) return res.status(400).json({message: "Product Name, price and category is required"});

        const user = await User.findOne({email});
        
        if(!user) return res.status(400).json({message: "User not found"});
        
        if(user.role !== 'seller') return res.status(401).json({message: "Product cannot be added from consumer account. Create a seller account to add products"});

        const newProduct = await Product.create({
            productName,
            price,
            image,
            description,
            category,
            stockAmount,
            seller: user._id
        });

        redisClient.del("products");
        res.status(200).json({success: true, product: newProduct});
    }catch(error){
        console.log("Error in productController ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function removeProduct(req: Request, res: Response): Promise<any> {
    const {id} = req.params;
    try{
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        redisClient.del("products");
    
        res.status(200).json({success: true, message: `Product ${product?.productName} deleted successfully`});
    }catch(error){
        console.log("Error in productController ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}