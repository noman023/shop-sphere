import mongoose, { Document, Schema, Model, Types } from "mongoose";

export type ProductCategory =
  | "electronics"
  | "clothing"
  | "home-garden"
  | "food-beverages"
  | "health-beauty"
  | "sports-outdoors"
  | "books-media"
  | "toys-games"
  | "automotive"
  | "office-supplies";

export interface IProduct extends Document {
  title: string;
  description?: string;
  image: string;
  category: ProductCategory;
  brand?: string;
  color?: string;
  price: number;
  quantity: number;
  wholesalePrice?: number;
  seller: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "electronics",
        "clothing",
        "home-garden",
        "food-beverages",
        "health-beauty",
        "sports-outdoors",
        "books-media",
        "toys-games",
        "automotive",
        "office-supplies",
      ],
    },
    brand: { type: String },
    color: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    wholesalePrice: { type: Number },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);

export default Product;

