import { Request, Response } from "express";
import Order from "../../models/OrderModel";
import Cart from "../../models/CartModel";
import { IOrderItem, IShippingAddress } from "../../models/OrderModel";
import mongoose from "mongoose";
import "../../types";

interface CreateOrderRequestBody {
  items: IOrderItem[];
  shippingMethod: string;
  paymentMethod: string;
  promo?: string;
  total: number;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export async function createOrder(
  req: Request & { body: CreateOrderRequestBody },
  res: Response
): Promise<void> {
  try {
    if (!req.user?._id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = req.user._id;
    const {
      items,
      shippingMethod,
      paymentMethod,
      promo,
      total,
      name,
      phone,
      address,
      city,
      state,
      zip,
      country,
    } = req.body;

    const shippingAddress: IShippingAddress = {
      name,
      phone,
      address,
      city,
      state,
      zip,
      country,
    };

    const order = new Order({
      buyer: new mongoose.Types.ObjectId(userId),
      items: items.map((item: IOrderItem) => ({
        product: new mongoose.Types.ObjectId(item.product.toString()),
        quantity: item.quantity
      })),
      shippingMethod,
      paymentMethod,
      promo,
      total,
      shippingAddress,
      status: "Pending",
    });

    await order.save();

    // Remove ordered items from cart
    const productIds = items.map((item: IOrderItem) => 
      new mongoose.Types.ObjectId(item.product.toString())
    );
    await Cart.findOneAndUpdate(
      { user: new mongoose.Types.ObjectId(userId) },
      { $pull: { items: { product: { $in: productIds } } } }
    );

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

