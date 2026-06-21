CREATE TABLE IF NOT EXISTS swipes (
  id BIGSERIAL PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_item_id VARCHAR(100) REFERENCES content_items(id),
  swipe_status VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_room_swipe ON swipes(room_id, user_id, content_item_id);
CREATE INDEX IF NOT EXISTS idx_swipes_room ON swipes(room_id);