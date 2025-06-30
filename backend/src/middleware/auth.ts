import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from './errorHandler';

interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw createError('Token de acesso requerido', 401);
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    
    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (err) {
        throw createError('Token inválido', 403);
      }

      req.userId = decoded.userId;
      req.userEmail = decoded.email;
      next();
    });
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    
    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (!err && decoded) {
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
      }
      next();
    });
  } catch (error) {
    next();
  }
};
