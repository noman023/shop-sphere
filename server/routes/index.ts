import { Router } from "express";
import authRoutes from "./authRoutes";
import productsRoutes from "./productsRoutes";
import cartRoutes from "./cartRoutes";
import orderRoutes from "./orderRoutes";
import wishlistRoutes from "./wishlistRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/wishlist", wishlistRoutes);

export default router;

