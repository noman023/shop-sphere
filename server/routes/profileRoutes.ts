import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddlware";
import upload from "../middleware/cloudinaryMiddleware";

import { getProfile } from "../controller/profileController/getProfile";
import { updateProfile } from "../controller/profileController/updateProfile";

const router: Router = Router();

router.get("/", authenticateUser, getProfile);
router.put("/", authenticateUser, upload.single("image"), updateProfile);

export default router;

