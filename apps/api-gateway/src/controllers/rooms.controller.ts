import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createRoom, joinRoom, getRoomById,
  getRoomContent, getRoomMembers, recordSwipe,
  CategoryType
} from "../services/room.service";
import { AppError } from "../middleware/errorHandler.middleware";

const VALID_CATEGORIES: CategoryType[] = ["MOVIES", "RESTAURANTS", "ACTIVITIES"];

export async function handleCreateRoom(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category_type } = req.body;
    if (!VALID_CATEGORIES.includes(category_type))
      throw new AppError(400, `category_type must be one of: ${VALID_CATEGORIES.join(", ")}`);
    res.status(201).json(await createRoom(req.userId!, category_type));
  } catch (err) { next(err); }
}

export async function handleJoinRoom(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await joinRoom(req.params.id, req.userId!));
  } catch (err) { next(err); }
}

export async function handleGetRoom(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await getRoomById(req.params.id));
  } catch (err) { next(err); }
}

export async function handleGetContent(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await getRoomContent(req.params.id));
  } catch (err) { next(err); }
}

export async function handleGetMembers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await getRoomMembers(req.params.id));
  } catch (err) { next(err); }
}

export async function handleSwipe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { content_item_id, swipe_status } = req.body;
    if (!content_item_id || !swipe_status)
      throw new AppError(400, "content_item_id and swipe_status are required");
    if (!["LIKE", "DISLIKE", "SUPERLIKE"].includes(swipe_status))
      throw new AppError(400, "swipe_status must be LIKE, DISLIKE or SUPERLIKE");
    res.json(await recordSwipe(req.params.id, req.userId!, content_item_id, swipe_status));
  } catch (err) { next(err); }
}