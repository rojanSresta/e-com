import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { addProduct, removeProduct } from "../controllers/product.controller";

const router = express.Router();
router.use(protectRoute);

router.post('/add', addProduct);
router.delete('/remove/:id', removeProduct);

export default router;