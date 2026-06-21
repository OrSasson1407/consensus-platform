CREATE TABLE IF NOT EXISTS content_items (
  id VARCHAR(100) PRIMARY KEY,
  category_type VARCHAR(30) NOT NULL,
  title VARCHAR(255) NOT NULL,
  image_url TEXT,
  meta_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);