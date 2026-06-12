import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const client = await prisma.user.upsert({
    where: { email: 'client@test.com' },
    update: {},
    create: { email: 'client@test.com', password, name: 'Test Client', role: 'CLIENT' },
  });

  const engineer1 = await prisma.user.upsert({
    where: { email: 'engineer1@test.com' },
    update: {},
    create: { email: 'engineer1@test.com', password, name: 'Alice Engineer', role: 'ENGINEER' },
  });

  const engineer2 = await prisma.user.upsert({
    where: { email: 'engineer2@test.com' },
    update: {},
    create: { email: 'engineer2@test.com', password, name: 'Bob Engineer', role: 'ENGINEER' },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@test.com' },
    update: {},
    create: { email: 'manager@test.com', password, name: 'Charlie Manager', role: 'MANAGER' },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: { email: 'admin@test.com', password, name: 'Admin', role: 'ADMIN' },
  });

  console.log('Seeded users');
  console.log({ client: client.id, engineer1: engineer1.id, engineer2: engineer2.id, manager: manager.id, admin: admin.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
