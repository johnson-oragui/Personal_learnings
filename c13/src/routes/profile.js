const express = require('express');
const ProfileController = require('../controllers/profileController');
const authenticationMiddleware = require('../middlewares/authMiddleware');
const { updateProfileRateLimit } = require('../middlewares/rateLimitMiddleware');
const upload = require('../config/uploadFileMulterConfig');

const profileRoute = express.Router();

// handles profile route for updating user profile name, email, and phone number
// /api/todo/userId/profile - PUT: Update the profile details of the authenticated user.
profileRoute.put('/api/todo/:userId/profile', updateProfileRateLimit, authenticationMiddleware, ProfileController.putProfile);
// handles the update/change of user profile password
// /api/todo/userId/password - PUT: Update the password of the authenticated user.
profileRoute.put('/api/todo/:userId/password', updateProfileRateLimit, authenticationMiddleware, ProfileController.putPassword);
// handles the update/change of user profile avatar
// /api/todo/userId/avatar - PUT: Update the avatar of the authenticated user.
profileRoute.put('/api/todo/:userId/avatar', updateProfileRateLimit, authenticationMiddleware, upload.single('avatar'), ProfileController.putAvatar);

module.exports = profileRoute;
