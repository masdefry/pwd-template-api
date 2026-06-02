import { ZodType } from 'zod';

export class Validation {
  // Parses data against the given Zod schema; throws ZodError on failure, which errorMiddleware maps to a 400 response.
  static validate<T>(schema: ZodType<T>, data: unknown): T {
    return schema.parse(data);
  }
}
