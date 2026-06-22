import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { getRoomById } from "../services/room.service";
import { generateRoomQR, generateRoomQRBuffer } from "../services/qr.service";
import { AppError } from "../middleware/errorHandler.middleware";

export async function handleGetRoomQR(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const room = await getRoomById(req.params.id);
    if (!room) throw new AppError(404, "Room not found");
    const format = (req.query.format as string) || "json";
    const baseUrl = process.env.APP_BASE_URL || "https://consensus.app";
    if (format === "png") {
      const buf = await generateRoomQRBuffer(req.params.id, baseUrl);
      res.setHeader("Content-Type", "image/png");
      res.send(buf);
    } else {
      const dataUrl = await generateRoomQR(req.params.id, baseUrl);
      res.json({ room_id: req.params.id, qr_data_url: dataUrl, join_url: `${baseUrl}/join/${req.params.id}` });
    }
  } catch (err) { next(err); }
}