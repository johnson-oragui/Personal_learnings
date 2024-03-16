const Todo = require('../models/todoModel');

const getTodo = async (userId, todoId) => {
  try {
    // find the todo items associated with the userId
    const todo = await Todo.findOne({ userId, _id: todoId });
    return todo;
  } catch (error) {
    console.error('error in getTodo cannot add todo: ', error.message);
    throw new Error('Failed to get todo');
  }
};

module.exports = getTodo;
