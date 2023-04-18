const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const { config, logger } = require('../utils')

const basename = path.basename(__filename)
let db = {}

const sequelize = new Sequelize({
  ...config.database,
  logging: msg => logger.debug(msg)
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    let model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
});

sequelize.sync({force: false});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

(async () => {
  try {
    await sequelize.authenticate();
    logger.info('DataBase connection has been established successfully.');
  } catch (error) {
    logger.error(`Unable to connect to the database: ${error}`);
  }
})();

module.exports = {
  sequelize: db.sequelize,
  Models: db.sequelize.models
}