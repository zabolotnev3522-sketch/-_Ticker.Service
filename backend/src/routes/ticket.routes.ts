import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { TicketService } from '../services/ticket.service';
import { authenticate, authorize } from '../middleware/auth';

export const ticketRouter = Router();
const ticketService = new TicketService();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);
}

const createTicketSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
});

const updateTicketSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
});

ticketRouter.post(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const data = createTicketSchema.parse(req.body);
    const ticket = await ticketService.create({ ...data, clientId: req.user!.userId });
    res.status(201).json(ticket);
  })
);

ticketRouter.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const { page, limit, status, priority } = req.query;
    const params: any = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status ? String(status) : undefined,
      priority: priority ? String(priority) : undefined,
    };

    if (req.user!.role === 'CLIENT') params.clientId = req.user!.userId;
    if (req.user!.role === 'ENGINEER') params.engineerId = req.user!.userId;

    const result = await ticketService.findAll(params);
    res.json(result);
  })
);

ticketRouter.get(
  '/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const ticket = await ticketService.findById(Number(req.params.id));
    res.json(ticket);
  })
);

ticketRouter.patch(
  '/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const data = updateTicketSchema.parse(req.body);
    const ticket = await ticketService.update(Number(req.params.id), data, req.user!.userId);
    res.json(ticket);
  })
);

ticketRouter.post(
  '/:id/assign',
  authenticate,
  authorize('MANAGER'),
  asyncHandler(async (req, res) => {
    const { engineerId } = z.object({ engineerId: z.number().optional() }).parse(req.body);
    const ticket = await ticketService.assignEngineer(Number(req.params.id), req.user!.userId, engineerId);
    res.json(ticket);
  })
);

ticketRouter.post(
  '/:id/claim',
  authenticate,
  authorize('ENGINEER'),
  asyncHandler(async (req, res) => {
    const ticket = await ticketService.claim(Number(req.params.id), req.user!.userId);
    res.json(ticket);
  })
);

ticketRouter.post(
  '/:id/comments',
  authenticate,
  asyncHandler(async (req, res) => {
    const { text } = z.object({ text: z.string().min(1) }).parse(req.body);
    const comment = await ticketService.addComment(Number(req.params.id), text, req.user!.userId);
    res.status(201).json(comment);
  })
);
