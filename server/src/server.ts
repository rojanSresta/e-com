import express from 'express';
import "dotenv/config";
import { connectDB } from './lib/db';
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import userRoutes from "./routes/user.route";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use("/", userRoutes);

app.listen(PORT, ()=>{
    console.log(`App listening on http://localhost:${PORT}`);
    connectDB();
});