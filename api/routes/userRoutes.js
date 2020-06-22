module.exports = function (app) {
  const userList = require("../controllers/userController");
  const awaitingList = require("../controllers/awaitingController");

  app.route("/users").get(userList.allUser).post(userList.addUser);
  app.route("/users/:email").get(userList.existUser);
  app.route("/login").post(userList.login)
  app.route("/logout").post(userList.logout)
  app.route("/checkPartner").post(userList.checkPartner)

  app
    .route("/awaiting")
    .get(awaitingList.allAwaiting)
    .post(awaitingList.addAwaiting);

  app.route("/awaiting/auth").post(awaitingList.authUser);

  app.route("/admin/login").post(userList.loginAdmin)
};
