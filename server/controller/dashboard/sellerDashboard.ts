import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../../models/OrderModel";
import Product from "../../models/ProductModel";

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d: Date) {
  const x = startOfDay(d);
  const day = x.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  x.setDate(x.getDate() + diff);
  return x;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export async function getSellerDashboard(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const sellerId = new mongoose.Types.ObjectId(userId);
    const now = new Date();

    const todayStart = startOfDay(now);
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const weekStart = startOfWeek(now);
    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const monthStart = startOfMonth(now);
    const lastMonthStart = new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, 1);

    const trendStart = new Date(todayStart);
    trendStart.setDate(trendStart.getDate() - 29);

    // Orders can contain items from multiple sellers, so we unwind items,
    // join each item's product to find its seller, and keep only this
    // seller's items. Revenue per order = sum(item.quantity * product.price)
    // for that seller's items only (not the order's full `total`).
    const [result] = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: Product.collection.name,
          localField: "items.product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      { $match: { "productInfo.seller": sellerId } },
      {
        $project: {
          orderId: "$_id",
          status: 1,
          createdAt: 1,
          itemRevenue: { $multiply: ["$items.quantity", "$productInfo.price"] },
        },
      },
      {
        $group: {
          _id: "$orderId",
          revenue: { $sum: "$itemRevenue" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
        },
      },
      {
        $facet: {
          salesToday: [
            { $match: { createdAt: { $gte: todayStart } } },
            { $group: { _id: null, total: { $sum: "$revenue" } } },
          ],
          salesYesterday: [
            { $match: { createdAt: { $gte: yesterdayStart, $lt: todayStart } } },
            { $group: { _id: null, total: { $sum: "$revenue" } } },
          ],
          salesThisWeek: [
            { $match: { createdAt: { $gte: weekStart } } },
            { $group: { _id: null, total: { $sum: "$revenue" } } },
          ],
          salesLastWeek: [
            { $match: { createdAt: { $gte: lastWeekStart, $lt: weekStart } } },
            { $group: { _id: null, total: { $sum: "$revenue" } } },
          ],
          salesThisMonth: [
            { $match: { createdAt: { $gte: monthStart } } },
            { $group: { _id: null, total: { $sum: "$revenue" } } },
          ],
          salesLastMonth: [
            { $match: { createdAt: { $gte: lastMonthStart, $lt: monthStart } } },
            { $group: { _id: null, total: { $sum: "$revenue" } } },
          ],
          statusCounts: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          revenueTrend: [
            { $match: { createdAt: { $gte: trendStart } } },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                total: { $sum: "$revenue" },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ]);

    const sum = (arr: { total: number }[]) => arr[0]?.total ?? 0;

    const salesToday = sum(result.salesToday);
    const salesYesterday = sum(result.salesYesterday);
    const salesThisWeek = sum(result.salesThisWeek);
    const salesLastWeek = sum(result.salesLastWeek);
    const salesThisMonth = sum(result.salesThisMonth);
    const salesLastMonth = sum(result.salesLastMonth);

    const statusMap: Record<string, number> = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    for (const s of result.statusCounts as { _id: string; count: number }[]) {
      if (s._id in statusMap) statusMap[s._id] = s.count;
    }

    const trendByDay = new Map<string, { day: string; revenue: number }>();
    for (let i = 0; i < 30; i++) {
      const d = new Date(trendStart);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      trendByDay.set(key, { day: key, revenue: 0 });
    }
    for (const row of result.revenueTrend as { _id: string; total: number }[]) {
      const entry = trendByDay.get(row._id);
      if (entry) entry.revenue = row.total;
    }

    res.status(200).json({
      sales: {
        today: { amount: salesToday, changePct: pctChange(salesToday, salesYesterday) },
        thisWeek: {
          amount: salesThisWeek,
          changePct: pctChange(salesThisWeek, salesLastWeek),
        },
        thisMonth: {
          amount: salesThisMonth,
          changePct: pctChange(salesThisMonth, salesLastMonth),
        },
      },
      orderStatus: statusMap,
      revenueTrend: Array.from(trendByDay.values()),
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}