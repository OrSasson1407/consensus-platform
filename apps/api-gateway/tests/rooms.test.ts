import request from "supertest";
import express from "express";
import cors from "cors";
import { errorHandler } from "../src/middleware/errorHandler.middleware";

// Minimal app for unit tests (no DB required)
const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use(errorHandler);

describe("Health", () => {
  it("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("Auth middleware", () => {
  app.get("/protected", (req: any, res, next) => {
    const header = req.headers.authorization;
    if (!header) { res.status(401).json({ error: "Missing token" }); return; }
    res.json({ ok: true });
  });

  it("rejects missing token", async () => {
    const res = await request(app).get("/protected");
    expect(res.status).toBe(401);
  });
});