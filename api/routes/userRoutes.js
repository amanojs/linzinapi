const express = require("express")

const userRouter = express.Router()

module.exports = () => {

  const userList = require("../controllers/userController");
  const awaitingList = require("../controllers/awaitingController");

  userRouter.route("/users").get(userList.allUser).post(userList.addUser);
  userRouter.route("/users/:email").get(userList.existUser);
  userRouter.route("/login").post(userList.login)
  userRouter.route("/logout").post(userList.logout)
  userRouter.route("/checkPartner").post(userList.checkPartner)

  userRouter
    .route("/awaiting")
    .get(awaitingList.allAwaiting)
    .post(awaitingList.addAwaiting);

  userRouter.route("/awaiting/auth").post(awaitingList.authUser);

  userRouter.route("/admin/login").post(userList.loginAdmin)

  return userRouter
};
