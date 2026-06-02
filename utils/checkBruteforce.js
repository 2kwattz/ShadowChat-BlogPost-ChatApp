const redisClient = require('../redis/redisClient'); // Redis Client for caching

const MAX_ATTEMPTS = 10; // Max Login Attempts
const MAX_WINDOW = 15 * 60; // IP + Email based Lockout Window

const checkBruteforce = async (identifier,ipAddress) => {

    const key = `login:${identifier}:${ipAddress}`; // Redis Cache Key 

}

module.exports = checkBruteforce;