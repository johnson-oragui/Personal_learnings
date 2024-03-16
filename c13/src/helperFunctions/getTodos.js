const Todo = require('../models/todoModel');

const getTodos = async (userId) => {
  try {
    // find the todo items associated with the userId
    const todos = await Todo.find({ userId }, { $sort: { createdAt: -1 } });
    return todos;
  } catch (error) {
    console.error('error in getTodos cannot add todo: ', error.message);
    throw new Error('Failed to get todos');
  }
};

module.exports = getTodos;
