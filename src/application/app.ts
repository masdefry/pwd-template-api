import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';
import cookieParser from 'cookie-parser';
import {
  ALLOWED_ORIGINS,
  API_PREFIX,
  NODE_ENV,
} from '../configs/dotenv.config';
import { errorMiddleware } from '@/middlewares/error.middleware';

/*
─────────────────────────────────────────────────────────────
Import Routers (uncomment & create as needed)
─────────────────────────────────────────────────────────────
*/
import { examplesRouter } from '@/features/examples/examples.router';

const app: Application = express();

/*
─────────────────────────────────────────────────────────────
Security Middleware
─────────────────────────────────────────────────────────────
*/
// Security Headers: Sets `X-Content-Type-Options`, `X-Frame-Options`, `HSTS`, etc.
app.use(helmet());

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

/*
─────────────────────────────────────────────────────────────
Cookie Parser
─────────────────────────────────────────────────────────────
*/

app.use(cookieParser());

/*
─────────────────────────────────────────────────────────────
Rate Limiter
─────────────────────────────────────────────────────────────
*/
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: StatusCodes.TOO_MANY_REQUESTS,
    message: 'Too many requests, please try again later.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: StatusCodes.TOO_MANY_REQUESTS,
    message: 'Too many login attempts, please try again later.',
  },
});

app.use(globalLimiter);

/*
─────────────────────────────────────────────────────────────
Request Parsing
─────────────────────────────────────────────────────────────
*/
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

/*
─────────────────────────────────────────────────────────────
Logging
─────────────────────────────────────────────────────────────
*/
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

/*
─────────────────────────────────────────────────────────────
Health Check
─────────────────────────────────────────────────────────────
*/
app.get('/health', (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    status: 'healthy',
    environment: process.env.NODE_ENV ?? 'development',
    timestamp: new Date().toISOString(),
  });
});

/*
─────────────────────────────────────────────────────────────
API Routes (uncomment & create as needed)
─────────────────────────────────────────────────────────────
*/
app.use(`${API_PREFIX}/examples`, examplesRouter);

// Placeholder route — remove when real routes are registered
app.get(API_PREFIX, (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: 'Eventria-API is running 🎟️',
    version: '1.0.0',
    docs: `${API_PREFIX}/docs`,
  });
});

/*
─────────────────────────────────────────────────────────────
404 Handler
─────────────────────────────────────────────────────────────
*/
app.use((_req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: StatusCodes.NOT_FOUND,
    message: 'Route not found.',
  });
});

/*
─────────────────────────────────────────────────────────────
Global Error Handler
─────────────────────────────────────────────────────────────
*/
app.use(errorMiddleware);

export default app;
