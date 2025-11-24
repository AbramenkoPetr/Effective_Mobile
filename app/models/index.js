const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
//console.log("index.js sequelize dbConfig ", dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD);
const sequelize = new Sequelize(  {
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);

module.exports = db;