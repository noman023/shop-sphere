import { Request, Response } from "express";
import Cart from "../../models/CartModel";
import mongoose from "mongoose";
import "../../types"; 

interface AddToCartRequestBody {
  productId: string;
  quantity?: number;
}

export async function addToCart(
  req: Request & { body: AddToCartRequestBody },
  res: Response
): Promise<void> {
  try {
    if (!req.user?._id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = req.user._id; // from authenticateUser middleware
    const { productId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({
      user: new mongoose.Types.ObjectId(userId as string),
    });

    if (!cart) {
      cart = new Cart({
        user: new mongoose.Types.ObjectId(userId as string),
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId as string),
        quantity,
      });
    }

    await cart.save();
    res.json({ message: "Product added to cart", cart });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}
