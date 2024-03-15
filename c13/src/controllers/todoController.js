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

class TodoController {
  static async getTodos(req, res, next) {
    const { userId } = req.params;
    if (!userId || userId.trim() === '') {
      console.error('userId missing getTodos');
      return res.status(400).json({ error: 'missing user id' });
    }
    try {
      const user = await confirmUserId(userId);

      if (!user) {
        console.error('user not found getTodos');
        return res.status(404).json({ error: user.message });
      }

      const todos = await getTodos(userId);
      if (todos instanceof Error || !todos) {
        console.error('Failed to get todos');
        return res.status(404).json({ error: todos.message });
      }
      return res.status(200).json({ todos });
    } catch (error) {
      console.error('error in get todos: ', error.message);
      next(error);
    }
    return null;
  }

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
        return res.status(404).json({ error: user.message });
      }

      const todo = await getTodo(userId, todoId);
      if (todo instanceof Error || !todo) {
        console.error('Failed to get todos');
        return res.status(404).json({ error: todo.message });
      }
      return res.status(200).json({ todo });
    } catch (error) {
      console.error('error in getTodos: ', error.message);
      next(error);
    }
    return null;
  }

  static async postTodo(req, res, next) {
    const { userId } = req.params.userId;
    const { title, todo } = req.body;
    if (!userId || userId.trim() === '') {
      console.error('userId missing postTodo');
      return res.status(400).json({ error: 'missing userid' });
    }
    if (!title || title.trim() === '' || !todo || todo.trim() === '') {
      console.error('title or todo missing');
      return res.status(400).json({ error: 'missing title or todo' });
    }
    try {
      const user = await confirmUserId(userId);

      if (!user) {
        console.error('no user found postTodo');
        return res.status(404).json({ error: user.message });
      }

      const newTodo = await addTodo(userId, { title, todo, userId });
      if (newTodo instanceof Error || !newTodo) {
        console.error('Failed to update todo');
        return res.status(404).json({ error: newTodo.message });
      }
      return res.status(200).json({ newTodo });
    } catch (error) {
      console.error('error in post todo: ', error.message);
      next(error);
    }
    return null;
  }

  static async putTodo(req, res, next) {
    const { userId } = req.params.userId;

    if (!userId || userId.trim() === '') {
      return res.status(400).json({ error: 'missing userid' });
    }

    try {
      const user = await confirmUserId(userId);

      if (!user) {
        console.error('no user found, putTodo');
        return res.status(404).json({ error: user.message });
      }

      // Extract fields to update from the request body
      const { title, todo, progress } = req.body;

      const updateFields = {};

      // Check if each field is provided in the request body and add it to the updateFields object
      if (title) updateFields.title = title;
      if (todo) updateFields.todo = todo;
      if (progress) updateFields.progress = progress;

      const updatedTodo = await addTodo(userId, updateFields);
      if (updatedTodo instanceof Error || !updatedTodo) {
        console.error('Failed to update todo');
        return res.status(404).json({ error: updatedTodo.message });
      }
      return res.status(200).json({ updatedTodo });
    } catch (error) {
      console.error('error in putTodo: ', error.message);
      next(error);
    }
    return null;
  }

  static async deleteTodo(req, res, next) {
    const { userId, todoId } = req.params;

    if (!userId || userId.trim() === '' || !todoId || todoId.trim() === '') {
      return res.status(400).json({ error: 'missing userId or todoId' });
    }

    try {
      const user = await confirmUserId(userId);

      if (!user) {
        console.error('no user found deleteTodo');
        return res.status(404).json({ error: user.message });
      }

      const newTodo = await deleteTodo(userId, todoId);
      if (newTodo instanceof Error || !newTodo) {
        console.error('Failed to delete todo');
        return res.status(404).json({ error: newTodo.message });
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
