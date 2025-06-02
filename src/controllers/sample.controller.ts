import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app.error';

export class SampleController {
  async getSampleData(req: Request, res: Response, next: NextFunction) {
    try {
      const { sample } = req.body;

      /*
         📒Docs:
         Using `AppError Class` for Error Handle Exception
      */
      if (!sample) throw new AppError('Sample data is not found', 404);

      res.status(200).json({
        success: true,
        message: 'Get data successfull',
        samples: [],
      });
    } catch (error) {
      next(error);
    }
  }
}
