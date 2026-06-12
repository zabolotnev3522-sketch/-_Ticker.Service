import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

beforeAll(async () => {
  execSync('npx prisma migrate deploy', { env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ticket_service_test?schema=public' } });
});

afterAll(async () => {
  await prisma.$disconnect();
});
