import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/index';
import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

describe('Ticket API', () => {
  let clientToken: string;
  let managerToken: string;
  let engineerToken: string;
  let ticketId: number;

  beforeAll(async () => {
    await prisma.user.deleteMany();

    const password = await bcrypt.hash('123456', 10);

    await prisma.user.create({
      data: { email: 'client@test.com', password, name: 'Client', role: 'CLIENT' },
    });
    await prisma.user.create({
      data: { email: 'engineer@test.com', password, name: 'Engineer', role: 'ENGINEER' },
    });
    await prisma.user.create({
      data: { email: 'manager@test.com', password, name: 'Manager', role: 'MANAGER' },
    });

    const clientRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'client@test.com', password: '123456' });
    clientToken = clientRes.body.token;

    const engineerRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'engineer@test.com', password: '123456' });
    engineerToken = engineerRes.body.token;

    const managerRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'manager@test.com', password: '123456' });
    managerToken = managerRes.body.token;
  });

  it('creates a ticket', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ title: 'Test issue', description: 'Something broke' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test issue');
    expect(res.body.status).toBe('NEW');
    ticketId = res.body.id;
  });

  it('lists tickets for client', async () => {
    const res = await request(app)
      .get('/api/tickets')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.status).toBe(200);
    expect(res.body.tickets.length).toBeGreaterThan(0);
    expect(res.body.tickets[0].client.email).toBe('client@test.com');
  });

  it('assigns engineer (manager only)', async () => {
    const res = await request(app)
      .post(`/api/tickets/${ticketId}/assign`)
      .set('Authorization', `Bearer ${managerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.engineer).toBeTruthy();
    expect(res.body.status).toBe('IN_PROGRESS');
  });

  it('rejects assign from non-manager', async () => {
    const res = await request(app)
      .post(`/api/tickets/${ticketId}/assign`)
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.status).toBe(403);
  });

  it('adds comment', async () => {
    const res = await request(app)
      .post(`/api/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${engineerToken}`)
      .send({ text: 'Working on it' });

    expect(res.status).toBe(201);
    expect(res.body.text).toBe('Working on it');
  });

  it('gets ticket detail with history', async () => {
    const res = await request(app)
      .get(`/api/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.status).toBe(200);
    expect(res.body.comments.length).toBeGreaterThan(0);
    expect(res.body.statusHistory.length).toBeGreaterThan(0);
  });
});
