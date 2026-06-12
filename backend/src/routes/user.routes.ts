import { Router, Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { authenticate, authorize } from '../middleware/auth';
import { AppError } from '../lib/errors';

export const userRouter = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);
}

userRouter.get(
  '/',
  authenticate,
  authorize('MANAGER'),
  asyncHandler(async (req, res) => {
    const { role, search } = req.query;
    const users = await userService.findAll({
      role: role ? String(role) : undefined,
      search: search ? String(search) : undefined,
    });
    res.json(users);
  })
);

userRouter.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const { name, email, role, password } = req.body;
    const user = await userService.update(id, { name, email, role, password });
    res.json(user);
  })
);

userRouter.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (id === req.user!.userId) throw new AppError(400, 'Cannot delete yourself');
    const result = await userService.delete(id);
    res.json(result);
  })
);

userRouter.get(
  '/engineers',
  authenticate,
  authorize('MANAGER'),
  asyncHandler(async (_req, res) => {
    const engineers = await userService.findEngineers();
    res.json(engineers);
  })
);
