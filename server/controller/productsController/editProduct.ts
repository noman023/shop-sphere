import { Request, Response } from "express";
import Product from "../../models/ProductModel";

interface ProductParams {
  id: string;
}

export async function editProduct(
  req: Request<ProductParams> & { file?: Express.Multer.File },
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle image if new one is uploaded (Cloudinary returns URL)
    if (req.file) {
      updateData.image = req.file.path; // Cloudinary returns URL in file.path
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

