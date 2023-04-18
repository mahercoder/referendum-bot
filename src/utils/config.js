const path = require('path');
const {
    NODE_ENV,
    BOT_TOKEN, OWNERS, ADMINS, CHANNEL_ID,
    DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, 
    DATABASE_HOST, DATABASE_PORT, DATABASE_DIALECT,
    REDIS_HOST, REDIS_PORT,
} = process.env;

const isProduction = ["production", "prod"].includes(NODE_ENV);

const config = {
    isProduction: isProduction,
    token: BOT_TOKEN,
    owners: (OWNERS || '').split(',').map((id) => +id),
    admins: (ADMINS || '').split(',').map((id) => +id),
    channelId: CHANNEL_ID,
    database: isProduction ? {
        database: DATABASE_NAME,
        username: DATABASE_USERNAME,
        password: DATABASE_PASSWORD,    
        host: DATABASE_HOST,
        port: DATABASE_PORT,
        dialect: DATABASE_DIALECT,
    } : {
        dialect: 'sqlite',
        storage: path.join(__dirname, '..', `/${DATABASE_NAME}.db3`)
    },
    redis: {
        host: REDIS_HOST,
        port: REDIS_PORT,
    },
};

module.exports = config;
