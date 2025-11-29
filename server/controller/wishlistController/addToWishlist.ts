import { Request, Response } from "express";
import Wishlist from "../../models/WishlistModel";
import mongoose from "mongoose";
import "../../types";

interface AddToWishlistRequestBody {
  productId: string;
}

export async function addToWishlist(
  req: Request & { body: AddToWishlistRequestBody },
  res: Response
): Promise<void> {
  try {
    if (!req.user?._id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = req.user._id;
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ 
      user: new mongoose.Types.ObjectId(userId) 
    });
    if (!wishlist) {
      wishlist = new Wishlist({ 
        user: new mongoose.Types.ObjectId(userId), 
        items: [] 
      });
    }

    // Prevent duplicate
    const productObjectId = new mongoose.Types.ObjectId(productId);
    if (!wishlist.items.some((id) => id.toString() === productId)) {
      wishlist.items.push(productObjectId);
      await wishlist.save();
    }

    res.json({ message: "Product added to wishlist", wishlist });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

