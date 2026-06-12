import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { AppError } from '../lib/errors';

export class AuthService {
  async register(email: string, password: string, name: string, role: string = 'CLIENT') {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) throw new AppError(409, 'Email already registered');

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name, role: role as any },
    });

    const token = this.generateToken(user.id, user.role);
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError(401, 'Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new AppError(401, 'Invalid credentials');

    const token = this.generateToken(user.id, user.role);
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  private generateToken(userId: number, role: string) {
    const secret = process.env.JWT_SECRET || 'secret';
    return jwt.sign({ userId, role }, secret, { expiresIn: '24h' });
  }
}

export const authService = new AuthService();
