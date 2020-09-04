const express = require("express")
const db = require("../config/mysql")
const chalk = require("chalk")
const debug = require("debug")("app:callRoutes")
const moment = require("moment")

const callRouter = express.Router()

let waitclients = []

let runclients = []

module.exports = () => {

  callRouter.ws("/wait", (ws, req) => {
    debug("wait connect")

    if (req.query.type === "partner" && "email" in req.query) {
      waitclients.push({ ws, email: req.query.email })
      debug(req.query.email)
      const sql = "INSERT INTO waiting VALUES(?,0);"
      db.query(sql, [req.query.email], (err, result) => {
        if (err) {
          throw err
        }
        debug(result)
      })
    }

    ws.on("close", () => {
      const sql = "DELETE FROM waiting WHERE email = ?;"
      db.query(sql, [req.query.email], (err, result) => {
        if (err) {
          throw err
        }
        debug(result)
      })
      waitclients = waitclients.filter((client) => {
        return client.ws !== ws
      })
      debug(chalk.cyan("[1]close"))
      debug("clients", waitclients)
    })
  })

  callRouter.ws("/room", (ws, req) => {
    debug("room connect:" + req.query.peerId)

    if (req.query.type === "partner") {
      runclients.push({ ws })
    }

    if ("peerId" in req.query) {
      const now = moment().toDate()
      const sql = "INSERT INTO running VALUES(null,?,?,null);"
      db.query(sql, [req.query.email, now], (err, result) => {
        if (err) {
          throw err
        }
      })
    }

    ws.on("close", () => {
      runclients = runclients.filter((client) => {
        return client.ws !== ws
      })
      const now = moment().toDate()
      console.log('now', now)
      const sql = "UPDATE running SET end = ? WHERE email = ? AND end IS NULL;"
      db.query(sql, [now, req.query.email], (err, result) => {
        if (err) {
          throw err
        }
        debug(result)
      })
      debug(chalk.cyan("[1]close"))
      debug("clients", req.query.peerId)
    })
  })

  return callRouter
}

/*

create table waiting(
  email varchar(256) PRIMARY KEY,
  flag Int(1)
);


create table running(
  runId Int(16) PRIMARY KEY AUTO_INCREMENT,
  email varchar(256) NOT NULL,
  start datetime NOT NULL,
  end datetime
);
*/