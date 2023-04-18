const path = require('path');
const winston = require('winston');
const config = require("./config");

const logDir = path.join(__dirname, '..', '/logs')

const logger = winston.createLogger({
  defaultMeta: {
    date: new Date(),
  },
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: `${logDir}/error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${logDir}/combined.log` }),
  ],
});

if (!config.isProduction) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
