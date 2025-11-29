import mongoose from "mongoose";

// MongoDB Atlas connection URI
const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASS}@cluster0.faeme9d.mongodb.net/ecom_dashboard?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to MongoDB Atlas
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err: Error) => console.error("❌ MongoDB connection error:", err));

