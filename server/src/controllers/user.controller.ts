import { Request, Response } from "express";
import Product from "../model/Product";
import redisClient from "../lib/redisClient";

export async function getAllProducts(req: Request, res: Response):Promise<void> {
    const DEFAULT_EXPIRATION = 3600;
    try{
        const cachedProducts = await redisClient.get("products");

        if(cachedProducts !== null){
            res.status(200).json({success: true, products: JSON.parse(cachedProducts)});
            return;
        }

        const products = await Product.find();
        redisClient.set("products", JSON.stringify(products), {EX: DEFAULT_EXPIRATION});

        res.status(200).json({success: true, products: products});
    }catch(error){
        console.log("Error in userController ", error);
        res.status(400).json({message: "Internal Server Error"});
    }
}