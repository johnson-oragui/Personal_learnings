const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`),
);

const fileTransport = new DailyRotateFile({
  filename: 'logs/application-%DATE%.log', // Filename pattern with date
  datePattern: 'YYYY-MM-DD', // Daily rotation
  zippedArchive: true, // Optional: Archive rotated files (optional)
  maxSize: '20m', // Rotate file when it reaches 20MB
  maxFiles: '140d', // Keep logs for the past 14 days (optional)
  level: 'debug', // Log messages of 'debug' level and above
  format: logFormat,
});

const logger = winston.createLogger({
  transports: [fileTransport], // Use the file transport
  level: 'debug', // Set the overall log level (optional)
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
      ([key]) => !key.toLowerCase().startsWith('authorization') && !key.toLowerCase().startsWith('cookie'),
    ),
  );
  logger.debug(`Incoming request: ${method} ${url} ${JSON.stringify(filteredHeaders)} ${path} ${ip}`);
  return next();
};

const responseLogger = (req, res, next) => {
  const { statusCode, originalUrl } = res;
  // Optionally anonymize or filter cookie data
  res.on('finish', () => {
    logger.debug(`Response sent: ${statusCode} ${JSON.stringify(originalUrl)}`);
  });
  return next();
};

const errorLogger = (err, req, res, next) => {
  // Optionally anonymize or filter cookie data
  logger.debug(`ERROR: ${err.message} : ${err.name} : ${JSON.stringify(err.stack)}`);
  return next();
};

const tokenLogger = (numOfTokensRemoved, tokenName, userId1) => {
  logger.debug(`Removed ${numOfTokensRemoved} expired ${tokenName} for user ${userId1}`);
};

module.exports = {
  requestLogger,
  responseLogger,
  errorLogger,
  tokenLogger,
};
