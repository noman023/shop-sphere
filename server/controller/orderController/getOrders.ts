import { Request, Response } from "express";
import Order from "../../models/OrderModel";
import mongoose from "mongoose";
import "../../types";

export async function getOrders(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.user?._id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = req.user._id;
    // Get all orders for the logged-in user, most recent first
    const orders = await Order.find({ 
      buyer: new mongoose.Types.ObjectId(userId) 
    })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

