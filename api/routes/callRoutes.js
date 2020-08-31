const express = require("express")
const chalk = require("chalk")
const debug = require("debug")("app:callRoutes")

const callRouter = express.Router()

module.exports = () => {

  callRouter.ws("/", (ws, req) => {
    ws.on("open", () => {
      debug("[1]connect:" + ws)
    })

    ws.on("close", () => {
      debug(chalk.cyan("[1]close"))
    })
  })

  return callRouter
}