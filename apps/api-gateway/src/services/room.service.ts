import { pool, withTransaction } from "../config/database";
import { AppError } from "../middleware/errorHandler.middleware";

export type CategoryType = "MOVIES" | "RESTAURANTS" | "ACTIVITIES";

export interface RoomRecord {
  id: string;
  creator_id: string;
  category_type: CategoryType;
  room_status: string;
  created_at: string;
  expires_at: string;
}

export async function createRoom(creatorId: string, categoryType: CategoryType): Promise<RoomRecord> {
  return withTransaction(async (client) => {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const roomRes = await client.query<RoomRecord>(
      `INSERT INTO rooms (creator_id, category_type, expires_at)
       VALUES ($1, $2, $3) RETURNING *`,
      [creatorId, categoryType, expiresAt]
    );
    const room = roomRes.rows[0];
    await client.query(
      `INSERT INTO room_members (room_id, user_id) VALUES ($1, $2)`,
      [room.id, creatorId]
    );
    return room;
  });
}

export async function joinRoom(roomId: string, userId: string): Promise<RoomRecord> {
  const roomRes = await pool.query<RoomRecord>(
    `SELECT * FROM rooms WHERE id = $1 AND room_status = 'ACTIVE'`,
    [roomId]
  );
  if (!roomRes.rows[0]) throw new AppError(404, "Room not found or no longer active");
  await pool.query(
    `INSERT INTO room_members (room_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [roomId, userId]
  );
  return roomRes.rows[0];
}

export async function getRoomById(roomId: string): Promise<RoomRecord> {
  const res = await pool.query<RoomRecord>(`SELECT * FROM rooms WHERE id = $1`, [roomId]);
  if (!res.rows[0]) throw new AppError(404, "Room not found");
  return res.rows[0];
}

export async function getRoomContent(roomId: string): Promise<object[]> {
  const roomRes = await pool.query<{ category_type: string }>(
    `SELECT category_type FROM rooms WHERE id = $1`, [roomId]
  );
  if (!roomRes.rows[0]) throw new AppError(404, "Room not found");
  const result = await pool.query(
    `SELECT * FROM content_items WHERE category_type = $1 ORDER BY created_at LIMIT 30`,
    [roomRes.rows[0].category_type]
  );
  return result.rows;
}

export async function getRoomMembers(roomId: string): Promise<object[]> {
  const result = await pool.query(
    `SELECT u.id, u.display_name, u.avatar_url, rm.joined_at
     FROM users u
     JOIN room_members rm ON rm.user_id = u.id
     WHERE rm.room_id = $1
     ORDER BY rm.joined_at`,
    [roomId]
  );
  return result.rows;
}

export async function recordSwipe(
  roomId: string, userId: string, contentItemId: string, swipeStatus: string
): Promise<{ isMatch: boolean }> {
  await pool.query(
    `INSERT INTO swipes (room_id, user_id, content_item_id, swipe_status)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (room_id, user_id, content_item_id) DO UPDATE SET swipe_status = EXCLUDED.swipe_status`,
    [roomId, userId, contentItemId, swipeStatus]
  );
  if (swipeStatus !== "LIKE" && swipeStatus !== "SUPERLIKE") return { isMatch: false };
  const likeRes = await pool.query(
    `SELECT COUNT(*) FROM swipes
     WHERE room_id = $1 AND content_item_id = $2 AND swipe_status IN ('LIKE','SUPERLIKE')`,
    [roomId, contentItemId]
  );
  const memberRes = await pool.query(
    `SELECT COUNT(*) FROM room_members WHERE room_id = $1`, [roomId]
  );
  const likes = parseInt(likeRes.rows[0].count);
  const members = parseInt(memberRes.rows[0].count);
  return { isMatch: members > 0 && likes >= members };
}