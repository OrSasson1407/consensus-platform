import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler.middleware";

type Schema = Record<string, "string" | "optional">;

export function validateBody(schema: Schema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    for (const [key, rule] of Object.entries(schema)) {
      if (rule === "string" && (req.body[key] === undefined || req.body[key] === "")) {
        throw new AppError(400, `Missing required field: ${key}`);
      }
    }
    next();
  };
}