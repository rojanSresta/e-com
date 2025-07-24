import express from "express";
import { order } from "../controllers/order.controller";
import { protectRoute } from "../middleware/auth.middleware";

const router = express.Router();
router.use(protectRoute);

router.post('/order', order);

export default router;