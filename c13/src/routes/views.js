const express = require('express');
const viewController = require('../controllers/viewsController');
const AuthController = require('../controllers/authController');
const regRateLimitMiddleware = require('../middlewares/regRateLimitMiddleware');
const loginRateLimitMiddleware = require('../middlewares/loginRateLimitMiddleware');
const loginLimiter = require('../middlewares/devRateLimits');

const viewsRoute = express.Router();

// handles user registration
viewsRoute.post('/api/todo/register', AuthController.postRegister);
// handles user login
viewsRoute.post('/api/todo/login', AuthController.postLogin);
viewsRoute.get('/api/todo/', loginRateLimitMiddleware, viewController.getHome);

module.exports = viewsRoute;
