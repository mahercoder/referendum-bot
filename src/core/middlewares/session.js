const { session } = require('telegraf');
const { Redis } = require('@telegraf/session/redis');
const { config } = require('../../utils');

const store = Redis({
    url: `redis://${config.redis.host}:${config.redis.port}`
});

const sessionMiddleware = config.isProduction 
    ? session({ store })
    : session();

module.exports = sessionMiddleware;