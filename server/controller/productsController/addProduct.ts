import { Request, Response } from "express";
import Product from "../../models/ProductModel";
import mongoose from "mongoose";
import "../../types";

interface AddProductRequestBody {
  title: string;
  description?: string;
  category: string;
  brand?: string;
  color?: string;
  price: number;
  wholesalePrice?: number;
  quantity: number;
}

export async function addProduct(
  req: Request & { file?: Express.Multer.File },
  res: Response
): Promise<void> {
  try {
    const {
      title,
      description,
      category,
      brand,
      color,
      price,
      wholesalePrice,
      quantity,
    } = req.body as AddProductRequestBody;

    // Handle image (Cloudinary returns URL in req.file)
    let image: string | null = null;
    if (req.file) {
      image = req.file.path || null; // Cloudinary returns URL in file.path
    }

    if (!req.user?._id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const product = new Product({
      title,
      description,
      image,
      category,
      brand,
      color,
      price,
      wholesalePrice,
      quantity,
      seller: new mongoose.Types.ObjectId(req.user._id),
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

