import { NextFunction, Request, Response } from 'express';

export class ExamplesController {
  static async list(req: Request, res: Response, next: NextFunction) {}

  static async create(req: Request, res: Response, next: NextFunction) {}

  static async update(req: Request, res: Response, next: NextFunction) {}

  static async delete(req: Request, res: Response, next: NextFunction) {}
}
