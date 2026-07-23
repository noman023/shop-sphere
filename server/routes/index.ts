import { Router } from "express";
import authRoutes from "./authRoutes";
import productsRoutes from "./productsRoutes";
import cartRoutes from "./cartRoutes";
import orderRoutes from "./orderRoutes";
import wishlistRoutes from "./wishlistRoutes";
import profileRoutes from "./profileRoutes";

const router:Router = Router();

router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/profile", profileRoutes);

export default router;

