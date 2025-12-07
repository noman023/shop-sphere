import { Router } from "express";
import { login } from "../controller/authController/login";
import { register } from "../controller/authController/register";

const router = Router();

router.post("/login", login);
router.post("/register", register);

export default router;
