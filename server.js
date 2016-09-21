/**
 * @fileoverview This is the server app script.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

// Important globals
const ALERT_RECEIVER_EMAIL = 'alvin.lin.dev@gmail.com';
const ALERT_SENDER_EMAIL = 'alert@omgimanerd.tech';
const IP = process.env.IP || 'localhost';
const NOTES_PATH = './public/rit-notes/latex';
const PORT_NUMBER = process.env.PORT || 5000;

// Sets the devMode variable during development if we run 'node server --dev'
var DEV_MODE = false;
process.argv.forEach(function(value, index, array) {
  if (value == '--dev' || value == '--development') {
    DEV_MODE = true;
  }
});

// Dependencies.
var bodyParser = require('body-parser');
var crypto = require('crypto');
var emailAlerts = require('email-alerts');
var express = require('express');
var http = require('http');
var morgan = require('morgan');
var shellJs = require('shelljs');
shellJs.config.silent = true;

// Initialization.
var alert = emailAlerts({
  fromEmail: ALERT_SENDER_EMAIL,
  toEmail: ALERT_RECEIVER_EMAIL,
  apiKey: process.env.SENDGRID_API_KEY,
  subject: 'Error - omgimanerd.tech'
});
var app = express();
var server = http.Server(app);

// Routers
var baseRouter = require('./routers/baseRouter')({
  alert: alert,
  devMode: DEV_MODE
});
var notesRouter = require('./routers/notesRouter')({
  alert: alert,
  devMode: DEV_MODE,
  notesPath: NOTES_PATH
});

app.set('port', PORT_NUMBER);
app.set('view engine', 'pug');
app.use(morgan(':date[web] :method :url :req[header] :remote-addr :status'));
app.use('/favicon.ico', express.static(__dirname + '/public/img/alpha.png'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use(bodyParser.urlencoded({
  extended: true,
  verify: function(request, response, buffer, encoding) {
    request.receivedHash = request.headers['x-hub-signature'];
    request.computedHash = 'sha1=' + crypto.createHmac('sha1',
        process.env.GITHUB_WEBHOOK_SECRET).update(buffer).digest('hex');
  }
}));

app.use('/', baseRouter);
app.use('/notes', notesRouter);
app.use(function(request, response) {
  response.status(404).render('error', {
    error: '404: Page not found!'
  });
});

// Starts the server.
server.listen(PORT_NUMBER, function() {
  console.log('STARTING SERVER ON PORT ' + PORT_NUMBER);
  var errorAction = function(error) {
    throw new Error(error);
  }
  if (DEV_MODE) {
    console.log('DEVELOPMENT MODE ENABLED: SERVING UNCOMPILED JAVASCRIPT!');
    errorAction = console.warn;
  }
  if (!process.env.GITHUB_WEBHOOK_SECRET) {
    errorAction('No Github webhook secret specified!');
  }
  if (!process.env.SENDGRID_API_KEY) {
    errorAction('No SendGrid API key specified!');
  }
  shellJs.pushd('./');
  if (shellJs.cd(NOTES_PATH).stderr) {
    errorAction('rit-notes directory not found!');
  }
  shellJs.popd();
});
