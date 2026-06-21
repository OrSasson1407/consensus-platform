import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { createRoom, joinRoom, getRoomById, getRoomContent, getRoomMembers, recordSwipe, CategoryType } from "../services/room.service";
import { AppError } from "../middleware/errorHandler.middleware";

export async function handleCreateRoom(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category_type } = req.body;
    const validCategories: CategoryType[] = ["MOVIES", "RESTAURANTS", "ACTIVITIES"];
    if (!validCategories.includes(category_type)) throw new AppError(400, `category_type must be one of: ${validCategories.join(", ")}`);
    const room = await createRoom(req.userId!, category_type);
    res.status(201).json(room);
  } catch (err) { next(err); }
}

export async function handleJoinRoom(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const room = await joinRoom(req.params.id, req.userId!);
    res.json(room);
  } catch (err) { next(err); }
}

export async function handleGetRoom(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const room = await getRoomById(req.params.id);
    res.json(room);
  } catch (err) { next(err); }
}

export async function handleGetContent(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const items = await getRoomContent(req.params.id);
    res.json(items);
  } catch (err) { next(err); }
}

export async function handleGetMembers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const members = await getRoomMembers(req.params.id);
    res.json(members);
  } catch (err) { next(err); }
}

export async function handleSwipe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { content_item_id, swipe_status } = req.body;
    if (!content_item_id || !swipe_status) throw new AppError(400, "content_item_id and swipe_status required");
    const validStatuses = ["LIKE", "DISLIKE", "SUPERLIKE"];
    if (!validStatuses.includes(swipe_status)) throw new AppError(400, `swipe_status must be one of: ${validStatuses.join(", ")}`);
    const result = await recordSwipe(req.params.id, req.userId!, content_item_id, swipe_status);
    res.json(result);
  } catch (err) { next(err); }
}