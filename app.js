'use strict';

var path = require('path');

var express = require('express');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var morgan = require('morgan');
var errorHandler = require('errorhandler');
var serveStatic = require('serve-static');

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

var passports = require('./config/passport')(config);

var app = express();

app.set('port', config.app.port);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(expressSession({
  saveUninitialized: true,
  resave: false,
  secret: 'hello world'
}));

app.use(passports.attach());
app.use(passports.middleware('initialize'));
app.use(passports.middleware('session'));

app.use(serveStatic(path.join(__dirname, 'public')));
app.use('/', require('./config/routes')(config, passports));

if (env === 'development') {
  console.log('Development mode.');
  app.use(errorHandler());
}
if (env === 'production') {
  console.log('Production mode.');
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('500', {
    error: err
  });
});

app.use(function(req, res, next) {
  res.status(404);
  if (req.accepts('html')) {
    res.render('404', {
      url: req.url
    });
    return;
  }
  if (req.accepts('json')) {
    res.send({
      error: 'Not found'
    });
    return;
  }
  res.type('txt').send('Not found');
});

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});