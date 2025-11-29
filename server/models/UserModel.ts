import mongoose, { Document, Schema, Model } from "mongoose";
import { UserRole } from "../types";

export interface IUser extends Document {
  name: string;
  email: string;
  userRole: UserRole;
  password: string;
  image: string | null;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userRole: { type: String, enum: ["seller", "customer"], required: true },
  password: { type: String, required: true },
  image: { type: String, default: null },
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;

