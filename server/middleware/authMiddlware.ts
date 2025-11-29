import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserPayload } from "../types";

dotenv.config();

const JWT_SECRET = process.env.SECRET_KEY as string;

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>

  if (!token) {
    res.status(401).json({ message: "Access token required." });
    return;
  }

  if (!JWT_SECRET) {
    res.status(500).json({ message: "JWT secret not configured." });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: "Invalid or expired token." });
      return;
    }

    req.user = decoded as UserPayload; // Add user info to request
    next();
  });
};

