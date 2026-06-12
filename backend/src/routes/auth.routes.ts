import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service';
import { authenticate, authorize } from '../middleware/auth';
import { AppError } from '../lib/errors';

export const authRouter = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);
}

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(['CLIENT', 'ENGINEER', 'MANAGER']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

authRouter.post(
  '/register',
  authenticate,
  authorize('ADMIN'),
  asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data.email, data.password, data.name, data.role);
    res.status(201).json(result);
  })
);

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data.email, data.password);
    res.json(result);
  })
);
