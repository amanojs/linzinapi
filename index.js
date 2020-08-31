
const express = require("express")
const bodyParser = require("body-parser")
const debug = require("debug")("app")
const chalk = require("chalk")
const logger = require("morgan")
const cookieParser = require("cookie-parser")
const session = require("express-session")

const app = express()
const port = 23450

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger("dev"))
app.use(cookieParser());
app.use(session({
  secret: "linzin",
  resave: false,
  saveUninitialized: true
}));
require("dotenv").config()
require("express-ws")(app)
const allowCrossDomain = require("./api/config/cors")
app.use(allowCrossDomain);


// APIrouting
const userRouter = require("./api/routes/userRoutes")()
const callRouter = require("./api/routes/callRoutes")()
app.use("/", userRouter)
app.use("/ws", callRouter)

app.get("/", (req, res) => {
  res.send("ok");
});

app.listen(port, () => {
  debug("REST API server started on " + chalk.yellow(port))
});
