const connection = require("../mysql.js");
const redis = require("redis")
const client = redis.createClient(6379, 'redis')

client.on('connect', () => {
  console.log('Redisに接続しました');
});

client.on('error', (err) => {
  console.log('Redisの接続でエラーが発生しました：' + err);
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

exports.allUser = (req, res) => {
  let sql = "SELECT * FROM userlist;";
  connection.query(sql, (err, result, fields) => {
    if (err) throw err;
    return res.json(result);
  });
};

exports.existUser = (req, res) => {
  const email = req.params.email;
  let sql = "SELECT * FROM userlist WHERE email=?;";
  connection.query(sql, email, (err, result) => {
    if (err) throw err;
    if (result.length == 0) return res.status(200).send(true);
    return res.send(false);
  });
};

exports.addUser = (req, res) => {
  const today = new Date();
  const date =
    today.getFullYear() +
    "/" +
    (today.getMonth() + 1) +
    "/" +
    (today.getDate() + 1);
  console.log(req.body);
  const email = req.body.email,
    pass = req.body.pass,
    card_url = req.body.card_url;
  const sql = "INSERT INTO userlist VALUES(?,?,?,?);";
  connection.query(sql, [email, pass, card_url, date], (err, result) => {
    if (err) throw error;
    return res.status(200).send(true);
  });
};

exports.login = (req, res) => {
  const email = req.body.email,
    pass = req.body.pass;
  let sql = "SELECT * FROM userlist WHERE email=? AND pass=?;";
  connection.query(sql, [email, pass], (err, result) => {
    if (err) throw err
    if (result.length > 0) {
      //ログイン完了処理
      const key = require('crypto').randomBytes(8).toString('hex')
      client.set(key, email)
      return res.status(200).send(key)
    } else {
      return res.status(200).send(false)
    }
  })
}

exports.logout = (req, res) => {
  const key = req.body.key
  console.log('delkey:', key)
  client.del(key, (err, result) => {
    if (err) throw err
    return res.send(result)
  })
}

exports.checkPartner = (req, res) => {
  console.log('key:', req.body.key)
  const key = req.body.key
  client.get(key, (err, result) => {
    if (err) throw err
    console.log(result)
    if (result) return res.send(result)
    return res.send(false)
  })
}

exports.loginAdmin = (req, res) => {
  const id = req.body.id,
    pass = req.body.pass;
  let sql = "SELECT * FROM admin WHERE id=? AND pass=? ;";
  connection.query(sql, [id, pass], (err, result) => {
    if (err) throw err
    if (result.length == 0) return res.status(200).send(false)
    return res.status(200).send(true)
  })
}

/*
  create table userlist(
    email VARCHAR(256) PRIMARY KEY NOT NULL,
    pass VARCHAR(256) NOT NULL,
    idcard VARCHAR(256) NOT NULL,
    created_at DATE NOT NULL
  );

  create table admin(
    id CHAR(16) PRIMARY KEY NOT NULL,
    pass VARCHAR(256) NOT NULL,
    level INT(1) NOT NULL
  );
*/
