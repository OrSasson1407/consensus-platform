import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { runMigrations, runSeeds } from "./config/database";
import { errorHandler } from "./middleware/errorHandler.middleware";
import usersRoutes from "./routes/users.routes";
import roomsRoutes from "./routes/rooms.routes";
import contentRoutes from "./routes/content.routes";
import qrRoutes from "./routes/qr.routes";
import { logger } from "./utils/logger";

const app = express();

app.use(helmet());
app.use(cors({ origin: "*", methods: ["GET","POST","PATCH","DELETE"] }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok", env: env.NODE_ENV }));

app.use("/api/users", usersRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/rooms", qrRoutes);   // mounts /:id/qr under /api/rooms
app.use("/api/content", contentRoutes);

app.use(errorHandler);

async function start() {
  try {
    await runMigrations();
    await runSeeds();
    app.listen(env.PORT, () => logger.info(`API Gateway on :${env.PORT} [${env.NODE_ENV}]`));
  } catch (err) {
    logger.error("Startup failed", err);
    process.exit(1);
  }
}

start();