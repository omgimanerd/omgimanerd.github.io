/**
 * @fileoverview This is the server app script.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

// Important globals
const IP = process.env.IP || 'localhost';
const PORT_NUMBER = process.env.PORT || 5000;

// Sets the DEV_MODE variable during development if we run 'node server --dev'
var DEV_MODE = false;
process.argv.forEach(function(value, index, array) {
  if (value == '--dev' || value == '--development') {
    DEV_MODE = true;
  }
});

// Dependencies.
var bodyParser = require('body-parser');
var crypto = require('crypto');
var express = require('express');
var gmailSend = require('gmail-send');
var http = require('http');
var morgan = require('morgan');
var pug = require('pug');

// Initialization.
var app = express();
var email = gmailSend({
  user: process.env.GMAIL_ACCOUNT,
  pass: process.env.GMAIL_APPLICATION_PASSWORD,
  to: process.env.GMAIL_ACCOUNT
});
var server = http.Server(app);
pug.filters = require('./lib/filters');

// Routers
var baseRouter = require('./routers/baseRouter')({
  dev_mode: DEV_MODE,
  email: email
});
var notesRouter = require('./routers/notesRouter')({
  dev_mode: DEV_MODE,
  email: email
});

app.set('port', PORT_NUMBER);
app.set('view engine', 'pug');
app.use(morgan(':date[web] :method :url :req[header] :remote-addr :status'));
app.use('/favicon.ico', express.static(__dirname + '/public/img/alpha.png'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/notes', notesRouter);
app.use('/', baseRouter);

// Starts the server.
server.listen(PORT_NUMBER, function() {
  console.log('STARTING SERVER ON PORT ' + PORT_NUMBER);
  if (DEV_MODE) {
    console.log('DEVELOPMENT MODE ENABLED: SERVING UNCOMPILED JAVASCRIPT!');
  }
  if (!process.env.GMAIL_ACCOUNT) {
    throw new Error('No Gmail account specified!');
  }
  if (!process.env.GMAIL_APPLICATION_PASSWORD) {
    throw new Error('No Gmail application password specified!');
  }
});
