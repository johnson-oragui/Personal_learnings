const express = require('express');
const UserController = require('../controllers/userController');
const authenticationMiddleware = require('../middlewares/authMiddleware');

const userRouter = express.Router();

// handles deletion of a user by admin, or user termination of account
userRouter.get('/api/todo/:userId/user/delete', authenticationMiddleware, UserController.deleteUser);

module.exports = userRouter;
