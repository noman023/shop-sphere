import { Request, Response } from "express";
import Wishlist from "../../models/WishlistModel";
import mongoose from "mongoose";
import "../../types";

export async function getWishlist(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.user?._id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = req.user._id;
    const wishlist = await Wishlist.findOne({ 
      user: new mongoose.Types.ObjectId(userId) 
    }).populate("items");
    res.json({ items: wishlist ? wishlist.items : [] });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

