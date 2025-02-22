import winston from 'winston';
import { Request } from 'express';

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  customFormat
);

export const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: logFormat,
  }));
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception thrown', error);
});

/**
 * Logger for requests
 * @param {Request} req Express request object
 * @param {string} message Message to log
 * @returns {void}
 */
export function logRequest(req: Request, message: string): void {
  logger.info(`${req.ip} ${req.method} ${req.originalUrl} - ${message}`);
}