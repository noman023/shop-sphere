import mongoose, { Document, Schema, Model, Types } from "mongoose";

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface IOrderItem {
  product: Types.ObjectId | string;
  quantity: number;
}

export interface IShippingAddress {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface IOrder extends Document {
  buyer: Types.ObjectId;
  items: IOrderItem[];
  shippingMethod: string;
  paymentMethod: string;
  shippingAddress: IShippingAddress;
  promo?: string;
  total: number;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
});

const orderSchema = new Schema<IOrder>(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingMethod: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    shippingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    promo: String,
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);

export default Order;

