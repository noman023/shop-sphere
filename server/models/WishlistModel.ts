import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IWishlist extends Document {
  user: Types.ObjectId;
  items: Types.ObjectId[];
}

const wishlistSchema = new Schema<IWishlist>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const Wishlist: Model<IWishlist> = mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;

