import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
  userId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        error: {
          message: 'Authentication required',
          code: 'UNAUTHORIZED'
        }
      });
      return;
    }

    const decoded = authService.verifyToken(token);
    req.user = decoded;
    req.userId = decoded.id; // Add userId for backward compatibility
    next();
  } catch (error) {
    res.status(401).json({
      error: {
        message: 'Invalid or expired token',
        code: 'UNAUTHORIZED'
      }
    });
  }
};

// Optional authentication - token bo'lsa user ma'lumotlarini qo'shadi, bo'lmasa davom etadi
export const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      try {
        const decoded = authService.verifyToken(token);
        req.user = decoded;
      } catch (error) {
        // Token noto'g'ri bo'lsa ham davom etamiz
        console.log('Invalid token in optional auth, continuing without user');
      }
    }
    next();
  } catch (error) {
    next();
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      error: {
        message: 'Admin access required',
        code: 'FORBIDDEN'
      }
    });
    return;
  }
  next();
};
