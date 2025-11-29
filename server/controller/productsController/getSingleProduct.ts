import { Request, Response } from "express";
import Product from "../../models/ProductModel";

interface ProductParams {
  id: string;
}

export async function getSingleProduct(
  req: Request<ProductParams>,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ product });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

