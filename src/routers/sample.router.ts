import { SampleController } from '../controllers/sample.controller';
import { Router } from 'express';
import { JwtVerify } from '../middlewares/jwt.verify';

export class SampleRouter {
  private router: Router;
  private sampleController: SampleController;

  constructor() {
    this.sampleController = new SampleController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      JwtVerify.verifyToken,
      this.sampleController.getSampleData
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
