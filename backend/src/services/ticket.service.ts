import { prisma } from '../lib/prisma';
import { AppError } from '../lib/errors';

interface CreateTicketData {
  title: string;
  description: string;
  priority?: string;
  clientId: number;
}

interface UpdateTicketData {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
}

export class TicketService {
  async create(data: CreateTicketData) {
    const ticket = await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || 'medium',
        clientId: data.clientId,
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
        engineer: { select: { id: true, name: true, email: true } },
      },
    });

    await prisma.statusHistory.create({
      data: {
        newStatus: 'NEW',
        ticketId: ticket.id,
        userId: data.clientId,
      },
    });

    return ticket;
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    clientId?: number;
    engineerId?: number;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.priority) where.priority = params.priority;
    if (params.clientId) where.clientId = params.clientId;
    if (params.engineerId) where.engineerId = params.engineerId;

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { id: true, name: true, email: true } },
          engineer: { select: { id: true, name: true, email: true } },
          _count: { select: { comments: true } },
        },
      }),
      prisma.ticket.count({ where }),
    ]);

    return { tickets, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: number) {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, email: true } },
        engineer: { select: { id: true, name: true, email: true } },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { id: true, name: true, role: true } } },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { id: true, name: true, role: true } } },
        },
      },
    });
    if (!ticket) throw new AppError(404, 'Ticket not found');
    return ticket;
  }

  async update(id: number, data: UpdateTicketData, userId: number) {
    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) throw new AppError(404, 'Ticket not found');

    const oldStatus = ticket.status;

    const updated = await prisma.ticket.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.status && { status: data.status as any }),
        ...(data.priority && { priority: data.priority }),
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
        engineer: { select: { id: true, name: true, email: true } },
      },
    });

    if (data.status && data.status !== oldStatus) {
      await prisma.statusHistory.create({
        data: {
          oldStatus: oldStatus as any,
          newStatus: data.status as any,
          ticketId: id,
          userId,
        },
      });
    }

    return updated;
  }

  async assignEngineer(ticketId: number, userId: number, engineerId?: number) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { engineer: { select: { id: true, name: true } } },
    });
    if (!ticket) throw new AppError(404, 'Ticket not found');

    let targetEngineerId = engineerId;

    if (!targetEngineerId) {
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
      if (engineers.length === 0) throw new AppError(400, 'No engineers available');
      const sorted = engineers.sort(
        (a, b) => a._count.assignedTickets - b._count.assignedTickets
      );
      targetEngineerId = sorted[0].id;
    }

    const targetEngineer = await prisma.user.findUnique({ where: { id: targetEngineerId } });
    if (!targetEngineer) throw new AppError(404, 'Target engineer not found');

    const oldStatus = ticket.status;
    const newStatus = ticket.status === 'NEW' ? 'IN_PROGRESS' : ticket.status;

    const oldEngineerName = ticket.engineer?.name;
    const oldEngineerId = ticket.engineerId;

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        engineerId: targetEngineerId,
        ...(ticket.status === 'NEW' && { status: 'IN_PROGRESS' }),
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
        engineer: { select: { id: true, name: true, email: true } },
      },
    });

    let note: string | undefined;

    if (oldEngineerId && oldEngineerId !== targetEngineerId) {
      note = `Переназначено с "${oldEngineerName}" на "${targetEngineer.name}"`;
    } else if (!oldEngineerId) {
      note = `Назначен инженер "${targetEngineer.name}"`;
    }

    if (newStatus !== oldStatus) {
      await prisma.statusHistory.create({
        data: { oldStatus: oldStatus as any, newStatus: newStatus as any, note, ticketId, userId },
      });
    } else if (note) {
      await prisma.statusHistory.create({
        data: { oldStatus: newStatus, newStatus, note, ticketId, userId },
      });
    }

    return updated;
  }

  async claim(ticketId: number, engineerId: number) {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new AppError(404, 'Ticket not found');
    if (ticket.status !== 'NEW') throw new AppError(400, 'Can only claim NEW tickets');

    const engineer = await prisma.user.findUnique({ where: { id: engineerId } });

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: { engineerId, status: 'IN_PROGRESS' },
      include: {
        client: { select: { id: true, name: true, email: true } },
        engineer: { select: { id: true, name: true, email: true } },
      },
    });

    await prisma.statusHistory.create({
      data: { oldStatus: 'NEW', newStatus: 'IN_PROGRESS', note: `Инженер "${engineer?.name}" взял заявку`, ticketId, userId: engineerId },
    });

    return updated;
  }

  async addComment(ticketId: number, text: string, userId: number) {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new AppError(404, 'Ticket not found');

    return prisma.comment.create({
      data: { text, ticketId, userId },
      include: { user: { select: { id: true, name: true, role: true } } },
    });
  }
}
