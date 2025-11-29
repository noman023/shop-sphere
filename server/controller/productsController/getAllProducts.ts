import { Request, Response } from "express";
import Product from "../../models/ProductModel";

export async function getAllProducts(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

