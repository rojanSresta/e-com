import { Request, Response } from "express";
import Product from "../model/Product";

export async function getAllProducts(req: Request, res: Response) {
    try{
        const products = await Product.find();
        res.status(200).json({success: true, products: products});
    }catch(error){
        console.log("Error in userController ", error);
        res.status(400).json({message: "Internal Server Error"});
    }
}