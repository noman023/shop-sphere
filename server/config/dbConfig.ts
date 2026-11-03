import mongoose from "mongoose";

const uri =
  process.env.NODE_ENV === "development"
    ? process.env.LOCAL_DB_URI!
    : process.env.DB_URI!;

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err: Error) => console.error("❌ MongoDB connection error:", err));
