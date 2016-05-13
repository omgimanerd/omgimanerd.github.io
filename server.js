/**
 * @fileoverview This is the server app script.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

// Constants
var DEV_MODE = false;
var IP = process.env.IP || 'localhost';
var PORT_NUMBER = process.env.PORT || 5000;

// Sets the DEV_MODE constant during development if we run 'node server --dev'
process.argv.forEach(function(value, index, array) {
  if (value == '--dev' || value == '--development') {
    DEV_MODE = true;
  }
});

// Dependencies.
var assert = require('assert');
var bodyParser = require('body-parser');
var express = require('express');
var gmailSend = require('gmail-send');
var http = require('http');
var morgan = require('morgan');
var swig = require('swig');

var renderData = require('./shared/data');

// Initialization.
var app = express();
var send = gmailSend({
  user: process.env.GMAIL_ACCOUNT,
  pass: process.env.GMAIL_APPLICATION_PASSWORD,
  to: process.env.GMAIL_ACCOUNT
});
var server = http.Server(app);

app.engine('html', swig.renderFile);

app.set('port', PORT_NUMBER);
app.set('view engine', 'html');

app.use(morgan(':date[web] :method :url :req[header] :remote-addr :status'));
app.use('/public',
        express.static(__dirname + '/public'));
// Use request.query for GET request params.
// Use request.body for POST request params.
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', function(request, response) {
  response.sendFile(__dirname + '/misc/auth.sh');
});

app.use('/alias_shred', function(request, response) {
  response.sendFile(__dirname + '/misc/alias_shred.sh');
});

app.get('/', function(request, response) {
  response.render('index.html', {
    dev_mode: DEV_MODE,
    renderData: renderData
  });
});

app.post('/message', function(request, response) {
  if (DEV_MODE) {
    response.send({
      error: null,
      result: null
    });
  } else {
    send({
      from: request.body.email,
      replyTo: request.body.email,
      subject: 'omgimanerd.tech - Message from ' + request.body.name,
      text: request.body.message
    }, function(error, result) {
      response.send({
        error: error,
        result: result
      });
    });
  }
});

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
