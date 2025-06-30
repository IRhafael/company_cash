import { Request, Response, NextFunction } from 'express';
import { db } from '../server';

export const attachDatabase = (req: any, res: Response, next: NextFunction) => {
  req.db = db;
  next();
};
