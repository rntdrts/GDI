var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session')

var passport = require('passport');
var mongoose = require('mongoose');
var location =  process.cwd() + "/";

var config = require(location + "config/config");

require('./config/passport')(passport); // pass passport for configuration

// connect to the database
mongoose.connect(config.get('mongoose:uri'));

var app = express();
var router = express.Router();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.cookieParser());
//app.use(express.bodyParser());
//app.use(express.methodOverride());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);
app.use(express.static(location + 'public'));

app.use('/leaflet', express.static(location + '/node_modules/leaflet/dist/'));
app.use('/leaflet-geocoder', express.static(location + '/node_modules/leaflet-control-geocoder/dist/'));
app.use('/public', express.static(location + '/public'));

var multiuser = require('./routes/routes')(app, passport); // load our routes and pass in our app and fully configured passport

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

app.listen(3000);

module.exports = app;
