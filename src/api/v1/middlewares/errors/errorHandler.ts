import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../types/errors/customError';

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  return res.status(err.HttpStatusCode).json(err.JSON);
};
