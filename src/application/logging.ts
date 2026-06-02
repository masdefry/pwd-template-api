import { NODE_ENV } from '@/configs/dotenv.config';
import winston from 'winston';

export const logger = winston.createLogger({
  level: NODE_ENV === 'production' ? 'warn' : 'debug',
  format: winston.format.json(),
  transports: [new winston.transports.Console({})],
});
