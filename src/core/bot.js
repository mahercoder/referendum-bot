const { Telegraf } = require('telegraf');
const { config } = require('../utils');

const bot = new Telegraf(config.token);

module.exports = bot;