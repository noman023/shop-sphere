import { Request, Response } from "express";
import User from "../../models/UserModel";

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const updates: any = { ...req.body };
  
    const file = (req.file as any) || null;
    if (file) {
      updates.image = file.path || file.secure_url || file.filename || updates.image;
    }

    const updated = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    res.status(200).json({ user: updated });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}