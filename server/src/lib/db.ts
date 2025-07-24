import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB connected on ${conn.connection.host}`);
    }catch(error){
        console.log("Error connecting to MongoDB ", error);
        process.exit(1);   
    }
}