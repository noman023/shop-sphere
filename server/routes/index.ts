import { Router } from "express";
import authRoutes from "./authRoutes";
import productsRoutes from "./productsRoutes";
import cartRoutes from "./cartRoutes";
import orderRoutes from "./orderRoutes";
import wishlistRoutes from "./wishlistRoutes";
import profileRoutes from "./profileRoutes";
import dashBoardRoutes from "./dashBoardRoutes";

const router:Router = Router();

router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/profile", profileRoutes);
router.use("/dashboard", dashBoardRoutes);

export default router;

