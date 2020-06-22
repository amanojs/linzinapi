const express = require("express"),
  app = express(),
  port = 443,
  bodyParser = require("body-parser");

var http = require("http");
var https = require("spdy");

var LEX = require("letsencrypt-express").testing();

var DOMAIN = "linzin.net";
var EMAIL = "takashivue@gmai.com";

var lex = LEX.create({
  configDir: require("os").homedir() + "/letsencrypt/etc",
  approveRegistration: function (hostname, approve) {
    // leave `null` to disable automatic registration
    if (hostname === DOMAIN) {
      // Or check a database or list of allowed domains
      approve(null, {
        domains: [DOMAIN],
        email: EMAIL,
        agreeTos: true,
      });
    }
  },
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const allowCrossDomain = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, access_token"
  );

  // intercept OPTIONS method
  if ("OPTIONS" === req.method) {
    res.send(200);
  } else {
    next();
  }
};

app.use(allowCrossDomain);

// リダイレクト処理
function redirectHttp() {
  http
    .createServer(
      LEX.createAcmeResponder(lex, function redirectHttps(req, res) {
        res.setHeader("Location", "https://" + req.headers.host + req.url);
        res.statusCode = 302;
        res.end("<!-- Hello Developer Person! Please use HTTPS instead -->");
      })
    )
    .listen(80);
}

// 通常の443接続
function serveHttps() {
  const routes = require("./api/routes/userRoutes");
  routes(app);

  app.use("/", function (req, res) {
    res.end("Hello World!");
  });

  https
    .createServer(lex.httpsOptions, LEX.createAcmeResponder(lex, app))
    .listen(443);
}

redirectHttp();
serveHttps();

console.log("REST API server started on " + "443");
