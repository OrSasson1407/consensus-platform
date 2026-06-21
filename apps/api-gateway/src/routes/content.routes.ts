import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getContentItems, getRestaurantsNearby } from "../controllers/content.controller";

const router = Router();
router.get("/", authMiddleware, getContentItems);
router.get("/restaurants/nearby", authMiddleware, getRestaurantsNearby);
export default router;