"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sweetsController_1 = require("../controllers/sweetsController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate); // all sweets routes require login
router.post("/", sweetsController_1.addSweet);
router.get("/", sweetsController_1.listSweets);
router.get("/search", sweetsController_1.searchSweets);
router.put("/:id", sweetsController_1.updateSweet);
router.delete("/:id", auth_1.requireAdmin, sweetsController_1.deleteSweet);
router.post("/:id/purchase", sweetsController_1.purchaseSweet);
router.post("/:id/restock", auth_1.requireAdmin, sweetsController_1.restockSweet);
exports.default = router;
