import { Request, Response } from "express";
import Cart from "../../models/CartModel";
import mongoose from "mongoose";
import "../../types";

interface DeleteCartItemRequestBody {
  productId: string;
}

export async function deleteCartItem(
  req: Request & { body: DeleteCartItemRequestBody },
  res: Response
): Promise<void> {
  try {
    if (!req.user?._id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = req.user._id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ 
      user: new mongoose.Types.ObjectId(userId) 
    });
    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.json({ message: "Item removed from cart", cart });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

