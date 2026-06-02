import type { Response, Request, NextFunction } from 'express';
import { ResponseError } from '@/error/response.error';
import { logger } from '@/application/logging';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

const handleResponseError = (error: ResponseError, res: Response): void => {
  // Expected business logic error thrown with an explicit HTTP status code.
  res.status(error.status).json({ status: 'error', message: error.message });
};

const handleZodError = (error: ZodError, res: Response): void => {
  // Return only field paths and messages; never expose the full ZodError internals.
  res.status(400).json({
    status: 'error',
    message: error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; '),
  });
};

const handleUnknownError = (error: Error, res: Response): void => {
  // Log the real error server-side; return a generic message to the client
  // to avoid leaking DB internals, stack traces, or constraint names.
  logger.error({ message: error.message, stack: error.stack });
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ status: 'error', message: 'Internal server error' });
};

export const errorMiddleware = (
  error: Error,
  _: Request,
  res: Response,
  __: NextFunction,
) => {
  if (error instanceof ResponseError) return handleResponseError(error, res);
  if (error instanceof ZodError) return handleZodError(error, res);
  handleUnknownError(error, res);
};
