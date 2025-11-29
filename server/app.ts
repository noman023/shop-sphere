import dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import "./types";

dotenv.config();

const app: Express = express();

// Database connection
import "./config/dbConfig";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ecom-client-xi-seven.vercel.app",
      "https://ecom-client-noman023-mojammel-nomans-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Debug middleware
app.use((req: Request, _res: Response, next: NextFunction): void => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Root route
app.get("/", (_req: Request, res: Response): void => {
  res.send("Welcome To ecom dashboard server!");
});

// All Routes
import apiRoutes from "./routes";
app.use("/api", apiRoutes);

// error handler
app.use((_req: Request, res: Response): void => {
  res.status(404).send("Route not found!");
});

export default app;

// Only listen on localhost for development
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
}
