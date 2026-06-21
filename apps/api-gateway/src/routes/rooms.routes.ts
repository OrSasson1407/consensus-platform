import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { handleCreateRoom, handleJoinRoom, handleGetRoom, handleGetContent, handleGetMembers, handleSwipe } from "../controllers/rooms.controller";

const router = Router();
router.post("/", authMiddleware, handleCreateRoom);
router.get("/:id", authMiddleware, handleGetRoom);
router.post("/:id/join", authMiddleware, handleJoinRoom);
router.get("/:id/content", authMiddleware, handleGetContent);
router.get("/:id/members", authMiddleware, handleGetMembers);
router.post("/:id/swipe", authMiddleware, handleSwipe);
export default router;