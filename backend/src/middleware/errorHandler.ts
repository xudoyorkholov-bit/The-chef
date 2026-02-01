import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/index.js';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });

  const errorResponse: ErrorResponse = {
    error: {
      message: err.message || 'Internal server error',
      code: 'INTERNAL_ERROR'
    }
  };

  res.status(500).json(errorResponse);
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      code: 'NOT_FOUND'
    }
  });
};
