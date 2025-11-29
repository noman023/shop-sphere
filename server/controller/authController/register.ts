import { Request, Response } from "express";
import User from "../../models/UserModel";
import bcrypt from "bcryptjs";

interface RegisterRequestBody {
  name: string;
  email: string;
  userRole: "seller" | "customer";
  password: string;
}

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export async function register(
  req: MulterRequest,
  res: Response
): Promise<void> {
  const { name, email, userRole, password } = req.body as RegisterRequestBody;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle image
    let imageUrl: string | null = null;
    if (req.file) {
      imageUrl = req.file.path || req.file.filename || null;
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      userRole,
      password: hashedPassword,
      image: imageUrl, // Save image filename/path
    });

    // Save user to the database
    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

