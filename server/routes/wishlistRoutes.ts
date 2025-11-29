import { Router } from "express";
import { addToWishlist } from "../controller/wishlistController/addToWishlist";
import { authenticateUser } from "../middleware/authMiddlware";
import { deleteFromWishlist } from "../controller/wishlistController/deleteFromWishlist";
import { getWishlist } from "../controller/wishlistController/getWishlist";

const router = Router();

router.post("/add", authenticateUser, addToWishlist);
router.get("/", authenticateUser, getWishlist);
router.delete("/delete", authenticateUser, deleteFromWishlist);

export default router;

