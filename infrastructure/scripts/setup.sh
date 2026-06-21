#!/usr/bin/env bash
set -euo pipefail

echo "==> Starting ConsensuS local setup..."

# 1. Start infra
docker compose -f infrastructure/docker/docker-compose.yml up -d postgres redis
echo "==> Waiting for Postgres..."
until docker exec consensus-postgres pg_isready -U postgres > /dev/null 2>&1; do sleep 1; done

# 2. Run migrations
for f in infrastructure/database/migrations/*.sql; do
  echo "    Applying $f"
  docker exec -i consensus-postgres psql -U postgres -d consensus < "$f"
done

# 3. Seed content
echo "==> Seeding content..."
docker exec -i consensus-postgres psql -U postgres -d consensus < infrastructure/database/seeds/seed_content.sql

# 4. Install node deps
echo "==> Installing Node dependencies..."
npm install

echo ""
echo "Setup complete. Start servers with:"
echo "  npm run dev:api          # API Gateway on :3001"
echo "  cd apps/realtime-server && go run ./cmd/server  # WS on :8080"