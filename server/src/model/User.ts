import mongoose, { CallbackWithoutResultAndOptionalError } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser{
    fullName: string;
    email: string;
    password: string;
    address?: string;
    phoneNumber: Number;
    role: string; 
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    address: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: Number,
        unique: true,
        required: true
    },
    role: {
        type: String,
        enum: ["consumer", "seller"],
        default: "consumer",
        required: true
    }
}, {timestamps: true});

userSchema.pre('save', async function(next: CallbackWithoutResultAndOptionalError){
    if(!this.isModified("password")) return next();
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch(error){
        next(error as Error);
    }   
});

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean>{
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model<IUser>("User", userSchema);

export default User;