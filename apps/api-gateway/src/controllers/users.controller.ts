import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { upsertUser } from "../services/auth.service";
import { pool } from "../config/database";
import { AppError } from "../middleware/errorHandler.middleware";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { phone_number, display_name } = req.body;
    const result = await upsertUser(phone_number, display_name);
    res.status(201).json(result);
  } catch (err) { next(err); }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const r = await pool.query(
      "SELECT id, phone_number, display_name, avatar_url, created_at FROM users WHERE id = $1",
      [req.userId]
    );
    if (!r.rows[0]) throw new AppError(404, "User not found");
    res.json(r.rows[0]);
  } catch (err) { next(err); }
}

export async function updateMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { display_name, avatar_url } = req.body;
    const r = await pool.query(
      `UPDATE users
       SET display_name = COALESCE($1, display_name),
           avatar_url   = COALESCE($2, avatar_url),
           updated_at   = NOW()
       WHERE id = $3
       RETURNING id, phone_number, display_name, avatar_url`,
      [display_name ?? null, avatar_url ?? null, req.userId]
    );
    if (!r.rows[0]) throw new AppError(404, "User not found");
    res.json(r.rows[0]);
  } catch (err) { next(err); }
}