const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor(host = 'localhost', port = 6379) {
    this.client = redis.createClient({ host, port });
    this.connectAsync = promisify(this.client.connect).bind(this.client);
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
    this.quitAsync = promisify(this.client.quit).bind(this.client);

    // handle redis events
    this.client.on('connect', () => console.log('Redis successfully connected'));
    this.client.on('ready', () => console.log('Redis client is ready'));
    this.client.on('error', () => console.log('error connecting to Redis'));
    this.client.on('close', () => console.log('Redis connection closed'));
    this.client.on('failure', () => console.log('Redis connection failed'));
  }

  /**
  * Gets the value associated with the specified key from the Redis server.
  *
  * @param {string} key - The key to get the value for.
  * @returns {Promise<string>} A promise that resolves to the value associated with
  *                           the specified key, or null if the key does not exist.
  */
  async connect() {
    try {
      // if (this.client.status === 'end') {
      //   console.log('reconnecting to redis');
      //   this.client = await redis.createClient();
      // }
      await this.connectAsync();
      return true;
    } catch (error) {
      console.error('error in asyncGet method', error.message);
      throw error;
    }
  }

  /**
  * Gets the value associated with the specified key from the Redis server.
  *
  * @param {string} key - The key to get the value for.
  * @returns {Promise<string>} A promise that resolves to the value associated with
  *                           the specified key, or null if the key does not exist.
  */
  async get(key) {
    try {
      // if (this.client.status === 'end') {
      //   console.log('reconnecting to redis');
      //   this.client = await redis.createClient();
      // }
      return await this.getAsync(key);
    } catch (error) {
      console.error('error in asyncGet method', error.message);
      throw error;
    }
  }

  /**
  * sets the value associated with the specified key from the Redis server.
  *
  * @param {string} key - The key to get the value for.
  * @param {string} value - The value to set to the key.
  * @returns {Promise<string>} A promise that resolves to the value associated with
  *                           the specified key, or null if the key does not exist.
  */
  async set(key, value) {
    try {
      // if (this.client.status === 'end') {
      //   console.log('reconnecting to redis');
      //   this.client = await redis.createClient();
      // }
      return await this.setAsync(key, value);
    } catch (error) {
      console.error('error in asyncSetex method', error.message);
      throw error;
    }
  }

  /**
  * Sets the value associated with the specified key in the Redis server.
  *
  * @param {string} key - The key to delete the value for.
  */
  async delete(key) {
    try {
      return await this.delAsync(key);
    } catch (error) {
      console.error('error in asyncDel method', error.message);
      throw error;
    }
  }

  /**
  * Closes the connection to the Redis server.
  *
  * @returns {Promise<void>} A promise that resolves when the connection has been closed.
  */
  async close() {
    try {
      return await this.asyncQuit();
    } catch (error) {
      console.error('error in asyncQuit method', error.message);
      throw error;
    }
  }
}
const redisClient = new RedisClient();
module.exports = redisClient;
