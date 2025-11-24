module.exports = {
  DB: "user_service",
  dialect: "sqlite",
  storage: "./user_service.sqlite",
  secretkey: "my_secret",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};