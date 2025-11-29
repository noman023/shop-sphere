import { Request, Response } from "express";
import Cart from "../../models/CartModel";
import mongoose from "mongoose";
import "../../types";

export async function getCartItems(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.user?._id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = req.user._id;

    const cart = await Cart.findOne({ 
      user: new mongoose.Types.ObjectId(userId) 
    }).populate({
      path: "items.product",
      populate: {
        path: "seller",
        select: "name _id",
      },
    });
    if (!cart) {
      res.json({ items: [] });
      return;
    }
    res.json({ items: cart.items });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

