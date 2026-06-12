import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/index';
import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

describe('Auth API', () => {
  let adminToken: string;

  beforeAll(async () => {
    await prisma.user.deleteMany();
    const password = await bcrypt.hash('123456', 10);
    await prisma.user.create({
      data: { email: 'admin@test.com', password, name: 'Admin', role: 'ADMIN' },
    });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: '123456' });
    adminToken = res.body.token;
  });

  it('registers a new user (admin only)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email: 'test@test.com', password: '123456', name: 'Test' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@test.com');
  });

  it('rejects duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email: 'test@test.com', password: '123456', name: 'Test' });

    expect(res.status).toBe(409);
  });

  it('rejects register without auth', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'unauth@test.com', password: '123456', name: 'Unauth' });

    expect(res.status).toBe(401);
  });

  it('logs in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('rejects invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'wrong' });

    expect(res.status).toBe(401);
  });
});
