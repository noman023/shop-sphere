import mongoose, { Document, Schema, Model } from "mongoose";
import { UserRole } from "../types";

export interface IUser extends Document {
  name: string;
  email: string;
  userRole: UserRole;
  password: string;
  image: string | null;
  phone?: string,
  address?: string,
  city?: string,
  country?:string,
  bio?:string,
  storeName?:string,
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userRole: { type: String, enum: ["seller", "customer"], required: true },
  password: { type: String, required: true },
  image: { type: String, default: null },

  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  country: { type: String, default: "" },
  bio: { type: String, default: "" },

  // seller-only
  storeName: { type: String, default: "" },
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;

