const fs = require('fs');
const path = require('path');
const winston = require('winston');

const logName = 'api.todo.log';
const transports = [];

transports.push(new winston.transports.Console());

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const logFile = path.join(logDir, logName);
transports.push(new winston.transports.File({ filename: logFile }));

const logger = new winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf((info) => `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`),
  ),
  transports,
});

const requestLogger = (req, res, next) => {
  const {
    method,
    url,
    path,
    ip,
  } = req;
  // Optionally filter out sensitive headers
  const filteredHeaders = Object.fromEntries(
    Object.entries(req.headers).filter(
      ([key]) => !key.toLowerCase().startsWith('authorization') && !key.toLowerCase().startsWith('cookie')
    ),
  );
  logger.debug(`Incoming request: ${method} ${url} ${JSON.stringify(filteredHeaders)} ${path} ${ip}`);
  return next();
};

const responseLogger = (req, res, next) => {
  const { statusCode, originalUrl } = res;
  // Optionally anonymize or filter cookie data
  res.on('finish', () => {
    logger.info(`Response sent: ${statusCode} ${JSON.stringify(originalUrl)}`);
  });
  return next();
};

module.exports = { requestLogger, responseLogger };
