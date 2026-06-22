import { Pool, PoolClient } from "pg";
import { env } from "./env";
import fs from "fs";
import path from "path";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => console.error("[DB] Pool error", err));

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function runMigrations(): Promise<void> {
  const migrationsDir = path.join(__dirname, "../../../../infrastructure/database/migrations");
  if (!fs.existsSync(migrationsDir)) { console.warn("[DB] No migrations dir"); return; }
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".sql")).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    await pool.query(sql);
    console.log(`[DB] Applied: ${file}`);
  }
}

export async function runSeeds(): Promise<void> {
  const seedFile = path.join(__dirname, "../../../../infrastructure/database/seeds/seed_content.sql");
  if (fs.existsSync(seedFile)) {
    await pool.query(fs.readFileSync(seedFile, "utf-8"));
    console.log("[DB] Seed applied");
  }
}