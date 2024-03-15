const express = require('express');
const AuthController = require('../controllers/authController');
const authenticationMiddleware = require('../middlewares/authMiddleware');

const authRoute = express.Router();

authRoute.get('/api/todo/:userId/logout', authenticationMiddleware, AuthController.postLogout);

module.exports = authRoute;
