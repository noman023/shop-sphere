import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddlware";
import { getSellerDashboard } from "../controller/dashboard/sellerDashboard";

const router:Router = Router();

router.get('/seller', authenticateUser, getSellerDashboard);

export default router;

