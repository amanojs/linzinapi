const functions = require("firebase-functions");
const express = require("express"),
  app = express(),
  port = 5000,
  bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const allowCrossDomain = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, access_token"
  );

  // intercept OPTIONS method
  if ("OPTIONS" === req.method) {
    res.send(200);
  } else {
    next();
    return;
  }
  return;
};

app.get("/", (req, res) => {
  res.send("ok");
});

app.use(allowCrossDomain);

//const routes = require("./api/routes/userRoutes");
//routes(app);

const userList = require("./api/controllers/userController");
const awaitingList = require("./api/controllers/awaitingController");
app.route("/api/users").get(userList.allUser).post(userList.addUser);
app.route("/users/:email").get(userList.existUser);
app.route("/login").post(userList.login);
app.route("/logout").post(userList.logout);
app.route("/checkPartner").post(userList.checkPartner);

app
  .route("/awaiting")
  .get(awaitingList.allAwaiting)
  .post(awaitingList.addAwaiting);

app.route("/awaiting/auth").post(awaitingList.authUser);

app.route("/admin/login").post(userList.loginAdmin);

const api = functions.https.onRequest(app);
module.exports = { api };
console.log("REST API server started on " + port);
