import {Request, Response} from "express";
import User from "../model/User";
import "dotenv/config";
import jwt, { Secret } from "jsonwebtoken";

export async function signup(req: Request, res: Response): Promise<any>{
    const {fullName, email, password, phoneNumber, role} = req.body;

    try{
        if(!fullName || !email || !password || !phoneNumber || !role){
            return res.status(400).json({message: "All fields are required"});
        }

        const passwordRegex = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!passwordRegex.test(password)) return res.status(400).json({message: "Password must have at least one each of a number, uppercase letter, lowercase letter, and non-alphanumeric, correct length"});

        if(!emailRegex.test(email)) return res.status(400).json({message: "Invalid email format"});
        if(phoneNumber.toString().length !== 10) return res.status(400).json({message: "Phone number length should be of 10"});

        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message: "Email already exists, please use a different one."});

        const newUser = await User.create({
            email, 
            fullName,
            password,
            phoneNumber,
            role,
        });

        const token = jwt.sign({userId: newUser._id}, process.env?.JWT_SECRET_KEY as Secret, {expiresIn: '7d'});

        res.cookie("jwt", token, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV == 'production'
        });
        
        res.status(201).json({success: true, user: newUser});
    }catch(error){
        console.log("Error Occured ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function login(req: Request, res: Response): Promise<any>{
    try {
        const {email, password} = req.body;
        
        if(!email || !password){
            res.status(400).json({message: "All fields are required"});
        }

        const user = await User.findOne({email});

        if(!user) return res.status(401).json({message: "Invalid email or password"});
        
        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect) return res.status(401).json({message: "Invalid email or password"});

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY as string, {expiresIn: "7d"});

        res.cookie("jwt", token, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true, //Xss attack
            sameSite: "strict", //csrf attack
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).json({success: true, user});
    } catch (error) {
        if(error instanceof Error){
            console.log("Error in login controller ", error.message)
        }
        else {
            console.log("Error in login controller", error);
        }
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function logout(req: Request, res: Response):Promise<any>{
    res.clearCookie("jwt");
    res.status(200).json({message: "Logout successful"});
}