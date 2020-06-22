const mysql = require("mysql");
const config = {
    host: "mysql",
    user: "root",
    password: "password",
    database: "linzin",
};

const connection = mysql.createConnection(config);

module.exports = connection
