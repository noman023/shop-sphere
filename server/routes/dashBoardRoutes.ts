import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddlware";
import { getSellerDashboard } from "../controller/dashboard/sellerDashboard";
import { getCustomerDashboard } from "../controller/dashboard/customerDashboard";

const router:Router = Router();

router.get('/seller', authenticateUser, getSellerDashboard);
router.get('/customer', authenticateUser, getCustomerDashboard);

export default router;

