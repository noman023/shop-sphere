import { Request, Response } from "express";
import mongoose from "mongoose";
import Order, { IOrder } from "../../models/OrderModel";
import Wishlist from "../../models/WishlistModel";

// Statuses that count as "not delivered yet"
const PENDING_DELIVERY_STATUSES = ["Pending", "Processing", "Shipped"];

type ActivityType =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Coupon";

interface Activity {
  type: ActivityType;
  title: string;
  description: string;
  time: string; // ISO string - format on the frontend
}

function shortId(id: mongoose.Types.ObjectId): string {
  return `ORD-${id.toString().slice(-6).toUpperCase()}`;
}

function statusToActivity(order: IOrder & { _id: mongoose.Types.ObjectId }): Activity {
  const id = shortId(order._id);
  const titles: Record<string, string> = {
    Pending: "Order Placed",
    Processing: "Order Processing",
    Shipped: "Order Shipped",
    Delivered: "Order Delivered",
    Cancelled: "Order Cancelled",
  };
  const descriptions: Record<string, string> = {
    Pending: `Your order #${id} has been placed`,
    Processing: `Your order #${id} is being processed`,
    Shipped: `Your order #${id} has been shipped`,
    Delivered: `Your order #${id} has been delivered`,
    Cancelled: `Your order #${id} has been cancelled`,
  };

  return {
    type: order.status as ActivityType,
    title: titles[order.status],
    description: descriptions[order.status],
    time: (order.updatedAt ?? order.createdAt ?? new Date()).toISOString(),
  };
}

export async function getCustomerDashboard(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const buyerId = new mongoose.Types.ObjectId(userId);

    const [totalOrders, pendingDeliveries, wishlist, recentOrders] = await Promise.all([
      Order.countDocuments({ buyer: buyerId }),
      Order.countDocuments({
        buyer: buyerId,
        status: { $in: PENDING_DELIVERY_STATUSES },
      }),
      Wishlist.findOne({ user: buyerId }).select("items"),
      Order.find({ buyer: buyerId })
        .sort({ updatedAt: -1 })
        .limit(10)
        .select("status promo createdAt updatedAt"),
    ]);

    // Build activity entries: one per order's current status, plus a
    // "coupon applied" entry for any recent order that used a promo code.
    const activities: Activity[] = [];

    for (const order of recentOrders) {
      activities.push(statusToActivity(order));

      if (order.promo) {
        activities.push({
          type: "Coupon",
          title: "Coupon Applied",
          description: `You used coupon '${order.promo}' on order #${shortId(order._id)}`,
          time: (order.createdAt ?? new Date()).toISOString(),
        });
      }
    }

    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    res.status(200).json({
      totalOrders,
      wishlistCount: wishlist?.items.length ?? 0,
      pendingDeliveries,
      activities: activities.slice(0, 5),
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}