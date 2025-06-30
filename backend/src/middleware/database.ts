import { Request, Response, NextFunction } from 'express';

// Vamos buscar o db de um global em vez de uma importação circular
declare global {
  var db: any;
}

export const attachDatabase = (req: any, res: Response, next: NextFunction) => {
  req.db = global.db;
  next();
};
