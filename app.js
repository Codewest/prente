var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require("fs");
var passport = require("passport");
var expressSession = require('express-session')

var routes = require('./routes/index');
var authroutes = require('./routes/auth');
var pictureroutes = require('./routes/pictures');
var memoriesroute = require('./routes/memories');

var memories = require('./lib/memories/memorymanager');

var app = express();

var session = expressSession({
    name: "connect.sid",
    secret: "applabcookiez",
	resave: true,
    saveUninitialized: true
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(bodyParser({limit:'50mb'}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/auth/', authroutes);
app.use("/pictures/", pictureroutes);
app.use("/memories/", memoriesroute);

// init uploaded pictures
fs.readdir('public/pictures/', function(err, files) {
    if(err) {
        console.error("Could not read picture folder: ", err);
        return;
    }
    files.forEach(function(file) {
        var filename = file.slice(0, -4);
        // no used because it's not saved right now
        memories.create(filename, -1, "");
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
