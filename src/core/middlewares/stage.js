const { Scenes } = require('telegraf');
const { Stage } = Scenes;
const scenes = require('../scenes');

const stage = new Stage(scenes);

module.exports = stage.middleware();