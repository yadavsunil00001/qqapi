

import winston from 'winston';
import config from '../../config/environment';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = new winston.Logger();

const transports = [
  new DailyRotateFile({
    name: 'error-file',
    datePattern: '.yyyy-MM-dd.log',
    filename: `${config.root}/logs/error`,
  }),
];

if (config.env === 'development') {
  const consoleTransport = new winston.transports.Console({
    handleExceptions: true,
    json: true,
  });
  transports.push(consoleTransport);
}

logger.configure({
  level: 'error',
  transports,
});

module.exports = logger;
