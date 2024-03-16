const Todo = require('../models/todoModel');

const addTodo = async (userId, todoData) => {
  try {
    // Create or update the todo item associated with the userId
    const todo = await Todo.findOneAndUpdate(
      { userId }, // Search for todo items by userId
      {
        userId: todoData.userId,
        title: todoData.sanitizedTitle,
        todo: todoData.sanitizedTodo,
      }, // Update with the new todoData
      { upsert: true, new: true }, // Options to create if not found and return the updated document
    );
    return todo;
  } catch (error) {
    console.error('error in  addTodo, cannot add todo: ', error.message);
    throw new Error('Failed to add todo');
  }
};

module.exports = addTodo;
