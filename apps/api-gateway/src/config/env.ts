import dotenv from "dotenv";
dotenv.config();

function required(key: string): string {
  const v = process.env[key];
  if (!v && process.env.NODE_ENV === "production") throw new Error(`Missing env var: ${key}`);
  return v ?? "";
}

export const env = {
  PORT: parseInt(process.env.PORT ?? "3001"),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/consensus",
  JWT_SECRET: process.env.JWT_SECRET ?? "consensus-dev-secret-change-in-prod",
  TMDB_API_KEY: process.env.TMDB_API_KEY ?? "",
  GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY ?? "",
  REALTIME_SERVER_URL: process.env.REALTIME_SERVER_URL ?? "http://localhost:8080",
};