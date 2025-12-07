import mongoose from "mongoose";

const uri =
  process.env.NODE_ENV === "development"
    ? process.env.LOCAL_DB_URI!
    : process.env.DB_URI!;

// Connect to MongoDB Atlas
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err: Error) => console.error("❌ MongoDB connection error:", err));
