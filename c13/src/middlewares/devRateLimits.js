const { default: rateLimit } = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowsMs: 0.5 * 60 * 1000, // 30 seconds
  max: 5, // 5 request per ip
  standardHeaders: true, // use headers
  legacyHeaders: false,
  handler: (req, res) => {
    console.log('req.rateLimit.remaining: ', req.rateLimit.remaining);
    console.log('req.rateLimit.resetTime: ', req.rateLimit.resetTime);

    const remainingAttempts = req.rateLimit.remaining;
    let retryAfter = Math.ceil(req.rateLimit.resetTime - Date.now() / 1000);

    const userIp = req.ip;

    console.log('userIp: ', userIp);
    const counter = {};

    counter[userIp] = {
      timestamp: Date.now(),
      attempts: 0,
    };

    console.log(counter[userIp]);
    if (counter[userIp]) {
      const currentAttempts = counter[userIp];
      const timeElapsed = Date.now() - counter[userIp].timestamp;
      console.log(counter[userIp]);
      if (remainingAttempts === 0 && timeElapsed < 0.5 * 60 * 1000) {
        retryAfter = Math.ceil((req.rateLimit.resetTime * (currentAttempts - 4)) / 1000);
        counter[userIp].timestamp = Date.now();
        console.log(counter[userIp]);

        res.status(429).json({
          error: 'Too many requests',
          message: `Exceeded login attempts, try again in ${retryAfter} seconds, remain Attempts is ${remainingAttempts}`,
        });
      } else {
        counter[userIp] = {
          timestamp: Date.now(),
          attempts: 0,
        };
      }
      if (!res.headersSent) {
        counter[userIp].attempts += 1;
      }
    }
  },
});

module.exports = loginLimiter;
