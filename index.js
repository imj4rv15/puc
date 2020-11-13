var fs = require('fs');
var path = require('path');

//npm modules
var express = require('express');
var cors = require('cors');
var helmet = require('helmet');
var multer = require('multer');
var bodyParser = require('body-parser');

var APP_PORT = process.env.APP_PORT || 8080;
console.log("App port", APP_PORT);
//application modules
var Router = require("./routes/v0/router");


var app = express();


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: false
})); // for parsing application/x-www-form-urlencoded
app.use(multer({
  dest: '/tmp/'
}).any()); // for parsing multipart/form-data

app.use(helmet());

var corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
      callback(null, true)
  },
  allowedHeaders: "Accept, Origin, X-Requested-With, X-Auth-Token, X-Auth-Userid, Authorization, Content-Type, Cache-Control, X-Session-ID, Access-Control-Allow-Origin, x-app-version, X-GEO-TOKEN, X-Geo-Token, x-geo-token, x-device-token",
};

app.use(cors(corsOptions));
app.options("*", cors());

//FIXME: Remove this
app.use("/static", express.static(path.join(__dirname, 'static')));
app.set('view engine', 'ejs');

app.all("*", function(req, res, done) {
  console.log(req.method + ' ' + req.url);
  if (process.env.NODE_ENV === 'development') {
    logger.info(req.path + " :: ", "REQ.HEADERS => ", req.headers);
    logger.info(req.path + " :: ", "REQ.BODY => ", req.body);
    logger.info(req.path + " :: ", "REQ.QUERY => ", req.query);
    logger.info(req.path + " :: ", "REQ.PARAMS => ", req.params);
  }
  done();
});


Router.mountAPI("/api/v1", app);

app.post("/cli", function(req, res){
    res.json({message: "Success!"});
});

app.get("/", function(req, res){
    res.json({message: "Success!"});
});

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
});

//missed routed
app.use(function(req, res, next) {
  var err = new Error('Not Found ' + req.method + ' ' + req.url + "\n\n");
  err.status = 404;
  next(err);
});

// Catch all error
app.use(function(err, req, res, next) {
  console.error(err, err.stack);
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (err.status === 403) {
    var resp = {
      status: 403,
      message: 'Unauthorized access. No credentials or token passed.'
    };
    res.status(403).json(resp);
  } else if (err.status === 404) {
    var resp = {
      status: 404,
      message: 'requested api endpoint not found.'
    };
    res.status(404).json(resp);
  } else if (err.status === 423) {
    var resp = {
      status: 423,
      message: 'Unauthorized device.'
    };
    res.status(423).json(resp);
  } else {
    var resp = {
      status: 500,
      message: 'Something went wrong.'
    };
    res.status(500).json(resp);
  }
});

app.listen(APP_PORT);
console.log('Server running at http://127.0.0.1:' + APP_PORT + '/');

//To support mocha test cases
module.exports = app;
