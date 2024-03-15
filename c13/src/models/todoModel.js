const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define the user schema
const todoSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Must include title'],
  },
  todo: {
    type: String,
    required: [true, 'Must include todo'],
  },
  progress: {
    type: String,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Must include userId'],
  },
});

// Create and export the User model
const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;
