import { Router } from "express";
import { listAllPurchases } from "../controllers/purchaseController";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, requireAdmin, listAllPurchases);

export default router;