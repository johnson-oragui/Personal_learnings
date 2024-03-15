const express = require('express');
const ProfileController = require('../controllers/profileController');
const authenticationMiddleware = require('../middlewares/authMiddleware');
const { updateProfileRateLimit } = require('../middlewares/rateLimitMiddleware');

const profileRoute = express.Router();

// handles profile route for updating user profile name, email, and phone number
profileRoute.put('/api/todo/:userId', updateProfileRateLimit, authenticationMiddleware, ProfileController.putProfile);
// handles the update/change of user profile password
profileRoute.put('/api/todo/:userId/password', updateProfileRateLimit, authenticationMiddleware, ProfileController.putPassword);
// handles the update/change of user profile avatar
profileRoute.put('/api/todo/:userId/avatar', updateProfileRateLimit, authenticationMiddleware, ProfileController.putAvatar);

module.exports = profileRoute;
