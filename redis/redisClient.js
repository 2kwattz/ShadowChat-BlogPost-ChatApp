const { Redis } = require('ioredis');

const redisClient = new Redis(); // It will hit our redis server
module.exports = redisClient



