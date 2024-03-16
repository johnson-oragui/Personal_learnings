/* eslint-disable no-else-return */
const { addBlockedIp, getBlockedIp, deleteBlockedIp } = require('../helperFunctions/addGetBlockedIp');

const regCheckRateLimit = async (req, res) => {
  try {
    const userIp = req.ip;

    // check if userIp is already blocked
    const blockedIp = await getBlockedIp(userIp);
    const { blockCount } = blockedIp.blockCount;
    if (blockedIp.userIp) {
      const now = Date.now();
      const { lastBlockedTime } = blockedIp.lastBlockedTime;
      const elapsedTime = now - lastBlockedTime;

      // Increase window size based on penalty factor and elapsed time
      const penaltyFactor = 2; // penalty factor (doubles window size)
      const windowSize = 5 * 60 * 1000; // (5 minutes in milliseconds)
      const increasedWindow = Math.min(windowSize * (penaltyFactor ** blockCount), windowSize * 10);

      // Check if elapsed time is greater than increased window, allowing retry
      if (elapsedTime > increasedWindow) {
        await deleteBlockedIp(userIp);
        return true;
      } else {
        // User is still blocked, return false and set Retry-After header
        res.setHeader('Retry-After', Math.ceil((increasedWindow - elapsedTime) / 1000));
        return false;
      }
    } else {
      // User not blocked, check for exceeding limit and update storage if needed
      const allowedAttempts = 5; // allowed attempts within window
      const requestCount = {}; // track request count for userIP within window
      if (requestCount.userIp) {
        requestCount.userIp = +1;
      } else {
        requestCount.userIp = 1;
      }
      if (requestCount.userIp >= allowedAttempts) {
        await addBlockedIp({ userIp, lastBlockedTime: Date.now(), blockCount: 1 });
        return false;
      }
      // User not blocked, allowed to proceed
      return true;
    }
  } catch (error) {
    console.error();
    throw new Error('Failed to check rate limit: ', error.message);
  }
};

const regRateLimitMiddleware = (req, res, next) => {
  if (!regCheckRateLimit(req)) {
    return res.status(429).json({ error: 'Too many requests, please try again later' });
  }
  return next(); // Proceed with request handling if not blocked
};

module.exports = regRateLimitMiddleware;
