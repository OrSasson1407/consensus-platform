import { Router } from "express";
import { register, getMe, updateMe } from "../controllers/users.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";

const router = Router();
router.post("/register", validateBody({ phone_number: "string", display_name: "string" }), register);
router.get("/me", authMiddleware, getMe);
router.patch("/me", authMiddleware, updateMe);
export default router;