#!/bin/sh
set -e

echo "Waiting for database..."
for i in $(seq 1 30); do
  npx prisma db push --accept-data-loss 2>/dev/null && break
  echo "Attempt $i/30: database not ready, retrying in 2s..."
  sleep 2
done

echo "Running migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx tsx prisma/seed.ts || true

echo "Starting server..."
exec node dist/index.js
