import { Router } from "express";
import { login } from "../controller/authController/login";
import { register } from "../controller/authController/register";
import upload from "../middleware/cloudinaryMiddleware";

const router = Router();

router.post("/login", login);
router.post("/register", upload.single("image"), register);

export default router;

