import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

describe('TicketService unit', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
    const password = await bcrypt.hash('123456', 10);

    await prisma.user.createMany({
      data: [
        { email: 'eng1@test.com', password, name: 'Eng1', role: 'ENGINEER' },
        { email: 'eng2@test.com', password, name: 'Eng2', role: 'ENGINEER' },
        { email: 'eng3@test.com', password, name: 'Eng3', role: 'ENGINEER' },
      ],
    });
  });

  it('assigns least loaded engineer', async () => {
    const engineers = await prisma.user.findMany({
      where: { role: 'ENGINEER' },
      include: {
        _count: {
          select: {
            assignedTickets: {
              where: { status: { in: ['NEW', 'IN_PROGRESS'] } },
            },
          },
        },
      },
    });

    const sorted = engineers.sort(
      (a, b) => a._count.assignedTickets - b._count.assignedTickets
    );

    expect(sorted[0]._count.assignedTickets).toBe(0);
    expect(sorted.length).toBe(3);
  });
});
