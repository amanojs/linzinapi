const mysql = require("mysql");
const chalk = require("chalk");
const debug = require("debug")("app:mysql")

const config = {
  host: process.env.DB_HOST,// mysql
  user: process.env.DB_USER,// root 
  password: process.env.DB_PASS,// password
  database: process.env.DB_NAME,
};

const connection = mysql.createConnection(config);
connection.connect(function (err) {
  if (err) {
    debug(chalk.red("error connecting: ") + err.stack);
    return;
  }
  debug(chalk.green("connected as id ") + connection.threadId);
});

module.exports = connection