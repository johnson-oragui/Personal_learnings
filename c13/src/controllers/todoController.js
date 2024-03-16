// takes in userId
const getTodos = require('../helperFunctions/getTodos');
// takes in userId and todoId
const getTodo = require('../helperFunctions/getTodo');
// takes in userId and todoData
const addTodo = require('../helperFunctions/addTodo');
// takes in userId and todoId
const deleteTodo = require('../helperFunctions/deleteTodo');
// takes userId
const confirmUserId = require('../helperFunctions/confirmUserId');
// saitize against xss
const xssValidator = require('../helperFunctions/xssValidator');

class TodoController {
  // /api/todo/userId - GET: Get all todos for the authenticated user.
  static async getTodos(req, res, next) {
    const { userId } = req.params;
    if (!userId || userId.trim() === '') {
      console.error('userId missing getTodos');
      return res.status(400).json({ error: 'missing user id' });
    }
    try {
      const user = await confirmUserId(userId);

      if (!user) {
        console.error('user not found getTodos.');
        return res.status(404).json({ error: 'user not found' });
      }

      const todos = await getTodos(userId);
      if (!todos) {
        console.error('todos empty');
        return res.status(404).json([]);
      }
      return res.status(200).json({ todos });
    } catch (error) {
      console.error('error in get todos: ', error.message);
      next(error);
    }
    return null;
  }

  // /api/todo/userId/todo/todoId - GET: Get a specific todo by ID.
  static async getTodo(req, res, next) {
    const { userId, todoId } = req.params;
    if (!userId || userId.trim() === '' || !todoId || todoId.trim() === '') {
      console.error('userId or todoId missing getTodo');
      return res.status(400).json({ error: 'missing userid or todoId' });
    }
    try {
      const user = await confirmUserId(userId);

      if (!user) {
        console.error('user not found getTodo');
        return res.status(404).json({ error: 'user not found' });
      }

      const todo = await getTodo(userId, todoId);
      if (!todo) {
        console.error('Failed to get todos');
        return res.status(404).json({ error: 'todo does not exist' });
      }
      return res.status(200).json({ todo });
    } catch (error) {
      console.error('error in getTodos: ', error.message);
      next(error);
    }
    return null;
  }

  // /api/todo/userId - POST: Create a new todo.
  static async postTodo(req, res, next) {
    const { userId } = req.params;

    if (!userId || userId.trim() === '') {
      console.error('userId missing postTodo');
      return res.status(400).json({ error: 'missing userid' });
    }

    const sanitizedTitle = xssValidator(req.body.title).toLowerCase();
    const sanitizedTodo = xssValidator(req.body.todo).toLowerCase();
    if (!sanitizedTitle || sanitizedTitle.trim() === '' || !sanitizedTodo || sanitizedTodo.trim() === '') {
      console.error('title or todo missing');
      return res.status(400).json({ error: 'missing title or todo' });
    }
    try {
      const user = await confirmUserId(userId);

      if (!user) {
        console.error('no user found postTodo');
        return res.status(404).json({ error: 'user not found' });
      }
      const todoData = {
        userId,
        title: sanitizedTitle,
        todo: sanitizedTodo,
      };

      const newTodo = await addTodo(userId, todoData);
      if (!newTodo) {
        console.error('Failed to add todo');
        return res.status(404).json({ error: 'could not create todo, try again later!' });
      }
      return res.status(200).json({ newTodo });
    } catch (error) {
      console.error('error in post todo: ', error.message);
      next(error);
    }
    return null;
  }

  // /api/todo/userId/todo/todoId - PUT: Update an existing todo by ID.
  static async putTodo(req, res, next) {
    const { userId, todoId } = req.params;

    if (!userId || userId.trim() === '' || !todoId || todoId.trim() === '') {
      console.error('missing userid or todoId');
      return res.status(400).json({ error: 'missing userid or todoId' });
    }

    try {
      const user = await confirmUserId(userId);

      if (!user) {
        console.error('no user found, putTodo');
        return res.status(404).json({ error: 'user not found' });
      }

      // Extract fields to update from the request body
      const sanitizedTitle = xssValidator(req.body.title).toLowerCase();
      const sanitizedTodo = xssValidator(req.body.todo).toLowerCase();
      const sanitizedProgress = xssValidator(req.body.progress).toLowerCase();
      if ((!sanitizedTitle || sanitizedTitle.trim() === '') && (!sanitizedTodo || sanitizedTodo.trim() === '')) {
        console.error('title or todo missing');
        return res.status(400).json({ error: 'must include title or todo' });
      }

      const todoData = {};

      // Check if each field is provided in the request body and add it to the todoData object
      if (userId) todoData.userId = userId;
      if (sanitizedTitle) todoData.title = sanitizedTitle;
      if (sanitizedTodo) todoData.todo = sanitizedTodo;
      if (sanitizedProgress) todoData.progress = sanitizedProgress;

      const updatedTodo = await addTodo(userId, todoData);
      if (!updatedTodo) {
        console.error('Failed to update todo');
        return res.status(404).json({ error: 'could not update todo, try again later!' });
      }
      return res.status(200).json({ updatedTodo });
    } catch (error) {
      console.error('error in putTodo: ', error.message);
      next(error);
    }
    return null;
  }

  // /api/todo/userId/todo/todoId - DELETE: Delete a todo by ID.
  static async deleteTodo(req, res, next) {
    const { userId, todoId } = req.params;

    if (!userId || userId.trim() === '' || !todoId || todoId.trim() === '') {
      console.error('missing userId or todoId');
      return res.status(400).json({ error: 'missing userId or todoId' });
    }

    try {
      const user = await confirmUserId(userId);

      if (!user) {
        console.error('no user found deleteTodo');
        return res.status(404).json({ error: 'user not found' });
      }

      const newTodo = await deleteTodo(userId, todoId);
      if (newTodo !== 'todo deleted successfully' || !newTodo) {
        console.error('Failed to delete todo');
        return res.status(404).json({ error: 'Failed to delete todo' });
      }
      return res.status(200).json({ message: 'todo successfully deleted' });
    } catch (error) {
      console.error('error in deleteTodo: ', error.message);
      next(error);
    }
    return null;
  }
}

module.exports = TodoController;
