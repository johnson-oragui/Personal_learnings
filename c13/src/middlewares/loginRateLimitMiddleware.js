/* eslint-disable no-else-return */
const { addBlockedIp, updateBlockedIp, getBlockedIp, deleteBlockedIp } = require('../helperFunctions/addGetBlockedIp');
const redisClient = require('../Utils/redisUtil');

const loginCheckRateLimit = async (req, res) => {
  try {
    const userIp = req.ip;

    // check if userIp is already blocked
    const blockedIp = await getBlockedIp(userIp);
    if (blockedIp) {
      console.log('user blocked ip from loginCheckRateLimit: ', blockedIp.userIp);
    }

    console.log('first if');
    if (blockedIp && blockedIp.userIp) {
      const now = Date.now();
      const { lastBlockedTime } = blockedIp.lastBlockedTime || ''; // lastBlockedTime from database
      const elapsedTime = now - lastBlockedTime; // time remaining to expire blocking

      // Increase window size based on penalty factor and elapsed time
      const penaltyFactor = 2; // penalty factor (doubles window size)
      const windowSize = 2.5 * 60 * 1000; // (5 minutes in milliseconds)
      const increasedWindow = Math.min(windowSize * (penaltyFactor ** blockedIp.blockCount), windowSize * 25);

      // Check if elapsed time is greater than increased window, allowing retry
      if (elapsedTime > increasedWindow) {
        await deleteBlockedIp(userIp);
        console.log('deleteing use ip');
        return true;
      } else {
        // User is still blocked, return false and set Retry-After header
        return Math.ceil((increasedWindow - elapsedTime) / 1000);
        // return false;
      }
    } else {
      console.log('second else');
      // User not blocked, check for exceeding limit and update storage if needed
      const allowedAttempts = 5; // allowed attempts within window
      const requestCounter = {}; // track request count for userIP within window
      if (requestCounter[userIp].attempts) {
        // requestCounter[userIp] += 1;
        requestCounter[userIp].attempts += 1;
      } else {
        // requestCounter[userIp] = 1;
        requestCounter[userIp] = {
          timestamp: Date.now(),
          attempts: 0,
        };
      }
      const requestCount = await updateBlockedIp(userIp, requestCounter[userIp].attempts);
      console.log('requestCount.userIp = ', requestCount);
      if (requestCount >= allowedAttempts) {
        await addBlockedIp({ userIp, lastBlockedTime: Date.now(), blockCount: 1 });
        return false;
      }
      // if (blockedIp && ((Date.now() - blockedIp) > ((2.5 * 60 * 1000) * (2 ** blockedIp.blockCount)))) {
      //   console.log('requestCount.userIp: ', requestCount.userIp);
      //   delete requestCount.userIp;
      // }
      // User not blocked, allowed to proceed
      return true;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to check rate limit: ');
  }
};

const loginRateLimitMiddleware = (req, res, next) => {
  const result = loginCheckRateLimit(req, res);
  if (!result) {
    return res.status(429).json({ error: 'Too many requests, please try again later' });
  }
  if (typeof loginCheckRateLimit(req, res) !== 'boolean') {
    res.setHeader('Retry-After', loginCheckRateLimit(req, res));
  }
  console.log('moving on');
  return next(); // Proceed with request handling if not blocked
};

module.exports = loginRateLimitMiddleware;
