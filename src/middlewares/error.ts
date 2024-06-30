import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  message: string;
}

const handleError = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal server error';

  res.status(err.statusCode).json({
    success: false,
    error: `${err.message}`
  });
}

export default handleError;
