const express = require("express")
const debug = require("debug")("app:callRoutes")

const callRouter = express.Router()

module.exports = () => {

  callRouter.ws("/", (ws, req) => {
    debug(ws)
  })

  return callRouter
}