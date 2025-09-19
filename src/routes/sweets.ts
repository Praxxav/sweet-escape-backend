import { Router } from "express";
import {
  addSweet,
  listSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} from "../controllers/sweetsController";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.use(authenticate); // all sweets routes require login

router.post("/", addSweet);
router.get("/", listSweets);
router.get("/search", searchSweets);
router.put("/:id", updateSweet);
router.delete("/:id", requireAdmin, deleteSweet);
router.post("/:id/purchase", purchaseSweet);
router.post("/:id/restock", requireAdmin, restockSweet);

export default router;
