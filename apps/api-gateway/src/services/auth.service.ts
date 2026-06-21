import { pool } from "../config/database";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface UserRecord {
  id: string;
  phone_number: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function upsertUser(phoneNumber: string, displayName: string): Promise<{ token: string; user: UserRecord }> {
  const result = await pool.query<UserRecord>(
    `INSERT INTO users (phone_number, display_name)
     VALUES ($1, $2)
     ON CONFLICT (phone_number)
     DO UPDATE SET display_name = EXCLUDED.display_name, updated_at = NOW()
     RETURNING *`,
    [phoneNumber, displayName]
  );
  const user = result.rows[0];
  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: "30d" });
  return { token, user };
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, env.JWT_SECRET) as { userId: string };
}