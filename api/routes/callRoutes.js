const express = require("express")
const db = require("../config/mysql")
const chalk = require("chalk")
const debug = require("debug")("app:callRoutes")

const callRouter = express.Router()

let clients = []

module.exports = () => {

  callRouter.ws("/", (ws, req) => {
    debug("[1]connect:" + ws)

    if (req.query.type === "partner") {
      clients.push({ ws })
    }

    ws.on("open", () => {
      debug("[1]connect:" + ws)
    })

    ws.on("close", () => {
      clients = clients.filter((client) => {
        return client.ws !== ws
      })
      debug(chalk.cyan("[1]close"))
      debug("clients", clients)
    })
  })

  return callRouter
}

/*

create table waiting(
  email varchar(256)
);

*/