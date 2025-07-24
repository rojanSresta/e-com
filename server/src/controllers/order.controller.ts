import { Request, Response } from "express";
import Order from "../model/Order";

export async function order(req: Request, res: Response): Promise<any> {
  try {
    const {
      buyerName,
      buyerAddress,
      price,
      productName,
      sellerName,
      paymentMethod,
      quantity,
    } = req.body;

    if (
      !buyerName ||
      !buyerAddress ||
      !price ||
      !productName ||
      !sellerName ||
      !paymentMethod ||
      !quantity
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newOrder = await Order.create({
      buyerName,
      buyerAddress,
      price,
      productName,
      sellerName,
      paymentMethod,
      quantity,
    });

    res.status(200).json({ success: true, order: newOrder });
  } catch (error) {
    console.log("Error in order controller ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
