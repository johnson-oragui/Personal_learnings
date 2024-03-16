const Todo = require('../models/todoModel');

const deleteTodo = async (userId, totoId) => {
  try {
    // delete the todo item associated with the userId
    await Todo.findOneAndDelete({ userId, _id: totoId });
    return 'todo deleted successfully';
  } catch (error) {
    console.error('error in deleteTodo, cannot delete todo: ', error.message);
    throw new Error('Failed to delete todo');
  }
};

module.exports = deleteTodo;
