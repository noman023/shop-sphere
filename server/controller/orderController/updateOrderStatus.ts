import { Request, Response } from "express";
import Order, { OrderStatus } from "../../models/OrderModel";

interface OrderParams {
  id: string;
}

interface UpdateOrderStatusRequestBody {
  status: OrderStatus;
}

export async function updateOrderStatus(
  req: Request<OrderParams, {}, UpdateOrderStatusRequestBody>,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
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

