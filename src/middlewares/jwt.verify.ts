import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/app.error';

export class JwtVerify {
  static verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      console.log(req.headers.authorization);
      if (!token || token === 'null') {
        throw new AppError('Bearer token is invalid or missing', 401);
      }

      const payload = jwt.verify(token, `${process.env.JWT_SECRET_KEY!}`);
      req.body['payload'] = payload;

      next();
    } catch (error) {
      next(error);
    }
  }
}
