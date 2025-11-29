import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId | string;
  quantity: number;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
}

const cartItemSchema = new Schema<ICartItem>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, default: 1 },
});

const cartSchema = new Schema<ICart>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
});

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;

