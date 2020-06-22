const connection = require("../mysql.js");
const axios = require("axios");

exports.allAwaiting = (req, res) => {
  const sql = "SELECT * FROM awaiting;";
  connection.query(sql, (err, result) => {
    if (err) throw err;
    return res.status(200).json(result);
  });
};

exports.addAwaiting = (req, res) => {
  console.log(req.body);
  const email = req.body.email,
    pass = req.body.pass,
    idcard = req.body.card_url;
  const today = new Date();
  const date =
    today.getFullYear() +
    "/" +
    (today.getMonth() + 1) +
    "/" +
    (today.getDate() + 1);
  const sql = "INSERT INTO awaiting VALUES(null,?,?,?,?);";
  connection.query(sql, [email, pass, idcard, date], (err, result) => {
    if (err) throw err;
    return res.status(200).send(true);
  });
};

exports.authUser = (req, res) => {
  console.log(req.body);
  const url = "http://127.0.0.1:23450/users";
  const email = req.body.email,
    pass = req.body.pass,
    idcard = req.body.card_url;
  const sql = "DELETE FROM awaiting WHERE email=?;";
  connection.query(sql, email, (err, result) => {
    if (err) throw err;
    axios
      .post(url, { email: email, pass: pass, card_url: idcard })
      .then((result) => {
        if (result) return res.status(200).send(true);
        if (result != true) return res.send(false);
      });
  });
};

exports.removeAwaiting = (req, res) => {
  const id = req.body.id;
  const sql = "DELETE id=? FROM awaiting;";
  connection.query(sql, id, (err, result) => {
    if (err) throw err;
    return res.status(200).send(true);
  });
};

/*
  CREATE TABLE awaiting(
    id INT(10) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    email VARCHAR(256) NOT NULL,
    pass VARCHAR(256) NOT NULL,
    idcard VARCHAR(256) NOT NULL,
    date: DATE NOT NULL
  );
*/
