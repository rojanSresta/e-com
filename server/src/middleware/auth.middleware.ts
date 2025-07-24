import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../model/User";

export const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<void>=>{
    try{
        const token = req.cookies.jwt;

        if(!token) res.status(401).json({message: "Unauthorized - No token provided"});

        const decoded = await <jwt.JwtPayload> jwt.verify(token, process.env.JWT_SECRET_KEY as string);

        if(!decoded) res.status(401).json({message: "Unauthorized - Invalid token"});

        const user = await User.findById(decoded.userId).select('-password');

        if(!user) res.status(401).json({message: "Unauthorized - User not found"});

        (req as any).user = user;
        next();
    }catch(error){
        console.log("Error in protectRoute Middleware ", error);
        res.status(500).json({message: "Internal Server Errot"});
    }
}