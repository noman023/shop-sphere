import { Request, Response } from "express";
import Order, { IOrder } from "../../models/OrderModel";
import mongoose from "mongoose";
import "../../types";

export async function getSellerOrders(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.user?._id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const sellerId = new mongoose.Types.ObjectId(req.user._id);

    // 1. Get all orders, populate product
    const orders = await Order.find()
      .populate({
        path: "items.product",
        select: "title seller", // add other fields as needed
      })
      .populate("buyer", "name email") // if you want buyer info
      .sort({ createdAt: -1 });

    // 2. Filter orders that have at least one item for this seller
    const sellerOrders = (orders as any[]).filter((order: IOrder) =>
      order.items.some(
        (item: any) =>
          item.product &&
          item.product.seller?.toString() === sellerId.toString()
      )
    );

    res.json({ orders: sellerOrders });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

