/**
 * @fileoverview This is the server app script.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

// Important globals
var DEV_MODE = false;
var IP = process.env.IP || 'localhost';
var PORT_NUMBER = process.env.PORT || 5000;
var NOTES_PATH = './public/rit-notes/latex';

// Sets the DEV_MODE constant during development if we run 'node server --dev'
process.argv.forEach(function(value, index, array) {
  if (value == '--dev' || value == '--development') {
    DEV_MODE = true;
  }
});

// Dependencies.
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var async = require('async');
var bodyParser = require('body-parser');
var express = require('express');
var gmailSend = require('gmail-send');
var http = require('http');
var morgan = require('morgan');

// Initialization.
var app = express();
var email = gmailSend({
  user: process.env.GMAIL_ACCOUNT,
  pass: process.env.GMAIL_APPLICATION_PASSWORD,
  to: process.env.GMAIL_ACCOUNT
});
var server = http.Server(app);

var renderData = require('./shared/data');

app.set('port', PORT_NUMBER);
app.set('view engine', 'pug');
app.use(morgan(':date[web] :method :url :req[header] :remote-addr :status'));
app.use('/favicon.ico', express.static(__dirname + '/public/img/alpha.png'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(request, response) {
  response.render('index', {
    dev_mode: DEV_MODE,
    renderData: renderData
  });
});

app.use('/notes', function(request, response) {
  var join = path.join;

  async.waterfall([
    function(callback) {
      fs.readdir(NOTES_PATH, callback);
    },
    function(dirs, callback) {
      async.filter(dirs, function(dir, filterCallback) {
        fs.stat(join(NOTES_PATH, dir), function(error, stats) {
          return filterCallback(error, stats.isDirectory());
        });
      }, function(error, results) {
        callback(error, results);
      });
    },
    function(dirs, callback) {
      var hierarchy = {};
      async.map(dirs, function(dir, mapCallback) {
        fs.readdir(join(NOTES_PATH, dir, 'output'), function(error, files) {
          hierarchy[dir] = files.filter(function(file) {
            return file.indexOf('.pdf') > 0;
          });
          return mapCallback(error);
        });
      }, function(error, results) {
        callback(error, hierarchy)
      });
    }
  ], function(error, results) {
    if (error) {
      response.status(500).render('error', {
        error: 'An error occurred. This has been logged. Try again later'
      });
    } else {
      response.render('notes', {
        notes: results
      });
    }
  });
});

app.post('/message', function(request, response) {
  if (DEV_MODE) {
    setTimeout(function() {
      response.send({
        error: null,
        result: null
      });
    }, 2500);
  } else {
    /**
     * The POST request must contain three fields:
     * email - The sender email that we can reply to.
     * name - The name of the person.
     * message - The message content.
     */
    var sender = request.body.email;
    var name = request.body.name;
    var message = request.body.message;
    if (!sender || !name || !message) {
      response.send({
        error: 'One of your message fields was blank!',
        result: null
      });
      return;
    }
    email({
      from: sender,
      replyTo: sender,
      subject: 'omgimanerd.tech - Message from ' + name,
      text: message
    }, function(error, result) {
      response.send({
        error: error,
        result: result
      });
    });
  }
});

app.use(function(request, response) {
  response.status(404).render('error', {
    error: '404: Page not found!'
  });
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
