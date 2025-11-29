import { Router } from "express";
import { addProduct } from "../controller/productsController/addProduct";
import { deleteProduct } from "../controller/productsController/deleteProduct";
import { editProduct } from "../controller/productsController/editProduct";
import { getAllProducts } from "../controller/productsController/getAllProducts";
import { getSellerProducts } from "../controller/productsController/getSellerProducts";
import { getSingleProduct } from "../controller/productsController/getSingleProduct";
import { authenticateUser } from "../middleware/authMiddlware";
import upload from "../middleware/cloudinaryMiddleware";

const router = Router();

router.get("/", getAllProducts);
router.get("/seller", authenticateUser, getSellerProducts);
router.get<{ id: string }>("/:id", getSingleProduct);
router.post("/add", authenticateUser, upload.single("image"), addProduct);
router.put<{ id: string }>("/edit/:id", authenticateUser, upload.single("image"), editProduct);
router.delete<{ id: string }>("/delete/:id", deleteProduct);

export default router;

