import { Router } from "express";
import { addToCart } from "../controller/cartController/addToCart";
import { authenticateUser } from "../middleware/authMiddlware";
import { getCartItems } from "../controller/cartController/getCartItems";
import { deleteCartItem } from "../controller/cartController/deleteCartItem";

const router = Router();

router
  .get("/", authenticateUser, getCartItems)
  .post("/add", authenticateUser, addToCart)
  .delete("/delete", authenticateUser, deleteCartItem);

export default router;

