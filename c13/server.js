/* eslint-disable no-unused-vars */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const viewsRoute = require('./src/routes/views');
const authRoute = require('./src/routes/auth');
const todoRoute = require('./src/routes/todos');
const profileRoute = require('./src/routes/profile');
const userRouter = require('./src/routes/user');
const refreshTokenRouter = require('./src/routes/refreshTokenRoute');
const MongoConnect = require('./src/Utils/mongoDbUtil');
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const { corsOption } = require('./src/config/corsOptions');
const accessControlCredential = require('./src/middlewares/AccessControlMiddleware');
const { requestLogger, responseLogger } = require('./src/Utils/logger');
const redisClient = require('./src/Utils/redisUtil');
const expireRevokedTokens = require('./src/automation/expireRevokedTokens');

dotenv.config();
const app = express();

// winston logging middleware
app.use(requestLogger);
app.use(responseLogger);

// access control allow origin middleware
app.use(accessControlCredential);

app.use(cors(corsOption));

// middleware for parsing JSON in request bodies
app.use(express.json());
// middleware for decoding URL-encoded form data.
app.use(express.urlencoded({ extended: false }));

// middleware for CookieParser
app.use(cookieParser());

const dbConnect = new MongoConnect();
// run every hour to remove expired tokens from the database
cron.schedule('0 1 * * *', expireRevokedTokens, {
  scheduled: true,
});
async function connectRedis() {
  try {
    await redisClient.connectAsync();
    console.log('Redis connected successfully! via server');
  } catch (error) {
    console.error('Error connecting to Redis:', error);
  }
}
connectRedis();

app.use('/', viewsRoute);
app.use('/', authRoute);
app.use('/', userRouter);
app.use('/', refreshTokenRouter);
app.use('/', todoRoute);
app.use('/', profileRoute);

const PORT = process.env.PORT || 5000;

// Error handler middleware
app.use('/', errorMiddleware);

app.listen(PORT, () => {
  console.log(`app running on http://localhost:${PORT}`);
});
