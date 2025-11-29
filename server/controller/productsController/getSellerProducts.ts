import { Request, Response } from "express";
import Product from "../../models/ProductModel";
import mongoose from "mongoose";
import "../../types";

export async function getSellerProducts(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.user?._id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const sellerId = req.user._id;
    const products = await Product.find({ 
      seller: new mongoose.Types.ObjectId(sellerId) 
    }).sort({
      createdAt: -1,
    });
    res.json({ products });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

