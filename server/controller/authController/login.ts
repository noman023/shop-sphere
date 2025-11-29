import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/UserModel";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.SECRET_KEY as string;

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function login(
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<void> {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    // Generate JWT token
    if (!JWT_SECRET) {
      res.status(500).json({ error: "JWT secret not configured" });
      return;
    }
    const token = jwt.sign(
      { _id: String(user._id), email: user.email, userRole: user.userRole },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userRole: user.userRole,
        image: user.image,
      },
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}
