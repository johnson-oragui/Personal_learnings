const express = require('express');
const TodoController = require('../controllers/todoController');
const authenticationMiddleware = require('../middlewares/authMiddleware');
const reqValidator = require('../middlewares/reqValidatorMiddleware');
const { allRouteRateLimit, deleteTasksRateLimit } = require('../middlewares/rateLimitMiddleware');

const todoRoute = express.Router();

// handles retrieving all todos for a user
todoRoute.get('/api/todo/:userId/', allRouteRateLimit,
  authenticationMiddleware, reqValidator, TodoController.getTodos);

// handles retrieving a single todo for a user
todoRoute.get('/api/todo/:userId/user/:todoId', allRouteRateLimit,
  authenticationMiddleware, reqValidator, TodoController.getTodo);

// reqValidator,handles creating a new todo for a user
todoRoute.post('/api/todo/:userId', authenticationMiddleware, reqValidator, TodoController.postTodo);

// handles updating a todo for a user
todoRoute.put('/api/todo/:userId/user/:todoId', allRouteRateLimit,
  authenticationMiddleware, reqValidator, TodoController.putTodo);

// handles deleting a todo for a user
todoRoute.delete('/api/todo/:userId/user/:todoId', deleteTasksRateLimit,
  authenticationMiddleware, reqValidator, TodoController.deleteTodo);

module.exports = todoRoute;
