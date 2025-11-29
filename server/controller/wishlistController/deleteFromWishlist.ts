import { Request, Response } from "express";
import Wishlist from "../../models/WishlistModel";
import mongoose from "mongoose";
import "../../types";

interface DeleteFromWishlistRequestBody {
  productId: string;
}

export async function deleteFromWishlist(
  req: Request & { body: DeleteFromWishlistRequestBody },
  res: Response
): Promise<void> {
  try {
    if (!req.user?._id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = req.user._id;
    const { productId } = req.body;

    const wishlist = await Wishlist.findOne({ 
      user: new mongoose.Types.ObjectId(userId) 
    });
    if (!wishlist) {
      res.status(404).json({ error: "Wishlist not found" });
      return;
    }

    wishlist.items = wishlist.items.filter(
      (id) => id.toString() !== productId
    );
    await wishlist.save();

    res.json({ message: "Product removed from wishlist", wishlist });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

