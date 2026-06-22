import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler.middleware";

export function validateBody(fields: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === "") {
        next(new AppError(400, `Missing required field: ${field}`));
        return;
      }
    }
    next();
  };
}