const { logger } = require('../../utils')

module.exports = err => {
    logger.error(err);
}