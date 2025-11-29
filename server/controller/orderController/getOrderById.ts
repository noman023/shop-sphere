import { Request, Response } from "express";
import Order from "../../models/OrderModel";

interface OrderParams {
  id: string;
}

export async function getOrderById(
  req: Request<OrderParams>,
  res: Response
): Promise<void> {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("buyer", "name email");
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json({ order });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

