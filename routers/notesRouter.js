/**
 * @fileoverview This file contains the router that handles access to the
 *   LaTeK notes.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const NOTES_PATH = './public/rit-notes/latex';

var async = require('async');
var crypto = require('crypto');
var express = require('express');
var fs = require('fs');
var githubWebhookHandler = require('github-webhook-handler');
var path = require('path');

var handler = githubWebhookHandler({
  path: '/',
  secret: 'secret'
});

/**
 * Defines the router that will be used to handle access to the LaTeK notes.
 * @param {Object} options Options that modify the behavior of the router.
 * @return {express.Router}
 */
module.exports = function(options) {
  var router = express.Router();
  var join = path.join;

  router.get('/', function(request, response) {
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
            }).map(function(current, index, array) {
              return '/' + join(NOTES_PATH, dir, 'output', current);
            });
            return mapCallback(error);
          });
        }, function(error, results) {
          callback(error, hierarchy);
        });
      }
    ], function(error, results) {
      if (error) {
        options.email({
          from: 'alert@omgimanerd.tech',
          replyTo: 'alert@omgimanerd.tech',
          subject: 'omgimanerd.tech - Error',
          text: 'Error: ' + error
        }, function() {
          response.status(500).render('error', {
            error: 'An error occurred. This has been logged. Try again later.'
          });
        });
      } else {
        response.render('notes', {
          notes: results
        });
      }
    });
  });

  /**
   * This route handles the
   */
  handler.on('push', function(event) {
    console.log('worked');
    console.log(event);
  });
  router.post('/update', handler);

  return router;
};
