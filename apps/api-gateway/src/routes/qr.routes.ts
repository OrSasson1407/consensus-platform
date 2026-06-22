import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { handleGetRoomQR } from "../controllers/qr.controller";

const router = Router();
// GET /api/rooms/:id/qr         -> JSON with data URL
// GET /api/rooms/:id/qr?format=png  -> raw PNG image
router.get("/:id/qr", authMiddleware, handleGetRoomQR);
export default router;