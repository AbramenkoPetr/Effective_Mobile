module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Create a new User
  router.post("/", users.create);

    // Authentication a  User
  router.post("/auth", users.auth);

  // Retrieve one Users
  router.get("/one", users.findById);

  // Retrieve all Users
  router.get("/", users.findAll);

  // Delete a User with id
  router.delete("/", users.delete);

  // Блокировка пользователя по id
  router.get("/blocking", users.blocking);

  // Delete all Users
  //router.delete("/", users.deleteAll);

  app.use('/api/users', router);
};
