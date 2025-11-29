import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddlware";
import { createOrder } from "../controller/orderController/createOrder";
import { getOrders } from "../controller/orderController/getOrders";
import { getSellerOrders } from "../controller/orderController/getSellerOrders";
import { updateOrderStatus } from "../controller/orderController/updateOrderStatus";
import { getOrderById } from "../controller/orderController/getOrderById";

const router = Router();

router.post("/create", authenticateUser, createOrder);
router.get("/", authenticateUser, getOrders);
router.get("/seller", authenticateUser, getSellerOrders);
router.get<{ id: string }>("/:id", authenticateUser, getOrderById);
router.patch<{ id: string }>("/:id/status", authenticateUser, updateOrderStatus);

export default router;

