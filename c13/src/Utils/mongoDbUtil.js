const mongoose = require('mongoose');

// Define constants for MongoDB connection
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABSAE || 'todo_users';

// Create the MongoDB connection URI based on the constants
const URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

class MongoConnect {
  constructor() {
    this.client = mongoose.connect(URI)
      .then((connected) => {
        console.log('connected to mongodb');
        this.db = connected.connection.db;
      })
      .catch((error) => {
        console.error('failed to connect to db', error.message);
      });
  }
}

module.exports = MongoConnect;
