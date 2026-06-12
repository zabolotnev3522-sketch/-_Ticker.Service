import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { AppError } from '../lib/errors';

export class UserService {
  async findAll(params?: { role?: string; search?: string }) {
    const where: any = {};
    if (params?.role) where.role = params.role;
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    return prisma.user.findMany({
      where,
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError(404, 'User not found');
    return user;
  }

  async update(id: number, data: { name?: string; email?: string; role?: string; password?: string }) {
    const user = await this.findById(id);
    if (data.email && data.email !== user.email) {
      const exists = await prisma.user.findUnique({ where: { email: data.email } });
      if (exists) throw new AppError(409, 'Email already in use');
    }
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.role) updateData.role = data.role;
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);
    return prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  async delete(id: number) {
    const user = await this.findById(id);
    await prisma.user.delete({ where: { id } });
    return { message: `User ${user.email} deleted` };
  }

  async findEngineers() {
    return prisma.user.findMany({
      where: { role: 'ENGINEER' },
      select: { id: true, email: true, name: true, createdAt: true },
      orderBy: { name: 'asc' },
    });
  }
}

export const userService = new UserService();
