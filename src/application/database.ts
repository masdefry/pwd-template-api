import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';
import { logger } from '@/application/logging';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
// In production, query logging is disabled to prevent SQL statements (including
// parameterized values) from appearing in log aggregators. Only errors are emitted.
const isProduction = process.env.NODE_ENV === 'production';

const prisma = new PrismaClient({
  adapter,
  log: isProduction
    ? [{ emit: 'event', level: 'error' }]
    : [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
});

prisma.$on('error', (e) => {
  logger.error(e);
});

prisma.$on('warn', (e) => {
  logger.warn(e);
});

prisma.$on('info', (e) => {
  logger.info(e);
});

prisma.$on('query', (e) => {
  logger.info(e);
});

export { prisma };
