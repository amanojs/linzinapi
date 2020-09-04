const express = require("express")
const db = require("../config/mysql")
const chalk = require("chalk")
const debug = require("debug")("app:callRoutes")

const callRouter = express.Router()

let waitclients = []

let runclients = []

module.exports = () => {

  callRouter.ws("/wait", (ws, req) => {
    debug("wait connect")

    if (req.query.type === "partner" && "email" in req.query) {
      waitclients.push({ ws, email: req.query.email })
      debug(req.query.email)
    }

    ws.on("close", () => {
      waitclients = waitclients.filter((client) => {
        return client.ws !== ws
      })
      debug(chalk.cyan("[1]close"))
      debug("clients", waitclients)
    })
  })

  callRouter.ws("/room", (ws, req) => {
    debug("room connect:" + ws)

    if (req.query.type === "partner") {
      runclients.push({ ws })
    }

    ws.on("close", () => {
      runclients = runclients.filter((client) => {
        return client.ws !== ws
      })
      debug(chalk.cyan("[1]close"))
      debug("clients", runclients)
    })
  })

  return callRouter
}

/*

create table waiting(
  email varchar(256) PRIMARY KEY,
  sdp varchar(5000) NOT NULL,
  flag Int(1)
);


create table running(
  runId Int(16) PRIMARY KEY AUTO_INCREMENT,
  email varchar(256) NOT NULL,
  sdp varchar(5000) NOT NULL,
  clinet varchar(5000) NOT NULL,
  start date NOT NULL,
  end date
);
*/