import mongoose from 'mongoose';

// define the schema for the Todo models
const TodoSchema = mongoose.Schema({
  // title of the todo
  title: {
    type: String,
    required: true,
  },
  // body of he todo
  content: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Todo', TodoSchema);
