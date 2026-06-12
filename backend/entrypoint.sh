#!/bin/sh
set -e

echo "Running migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx tsx prisma/seed.ts || true

echo "Starting server..."
exec node dist/index.js
