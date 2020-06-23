const mysql = require("mysql");
const config = {
  host: "localhost",//160.16.63.183
  user: "root",
  password: "password",
  database: "linzin",
};

const connection = mysql.createConnection(config);

module.exports = connection;
