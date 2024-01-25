import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo';

const MongoClient = async () => {
  try {
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(MONGODB_URI);

    console.log(`Database connected: ${conn.connection.name}`);
  } catch (error) {
    console.error('error in MongoDb connection', error.message);
  }
};

export default MongoClient;
