import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../lib/errors';

export interface AuthPayload {
  userId: number;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new AppError(401, 'Missing or invalid token');
  }

  const token = header.slice(7);
  const secret = process.env.JWT_SECRET || 'secret';
  const payload = jwt.verify(token, secret) as AuthPayload;
  req.user = payload;
  next();
}

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError(403, 'Insufficient permissions');
    if (req.user.role === 'ADMIN' || roles.includes(req.user.role)) {
      return next();
    }
    throw new AppError(403, 'Insufficient permissions');
  };
}
