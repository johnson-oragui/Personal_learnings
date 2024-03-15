const express = require('express');
const RefreshToken = require('../controllers/refreshTokenController');

const refreshTokenRouter = express.Router();

// Route to handle refresh token requests
refreshTokenRouter.get('/api/todo/:userId/refresh', RefreshToken.refreshToken);

module.exports = refreshTokenRouter;
