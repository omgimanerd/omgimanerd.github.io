/**
 * @fileoverview This file contains the router that handles access to the
 *   LaTeK notes.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var async = require('async');
var bufferEqual = require('buffer-equal-constant-time');
var express = require('express');
var shellJs = require('shelljs');
var fs = require('fs');
var path = require('path');

var alert = require('../lib/alert')(process.env.SENDGRID_API_KEY);

/**
 * Defines the router that will be used to handle access to the LaTeK notes.
 * @param {Object} options Options that modify the behavior of the router.
 * @return {express.Router}
 */
module.exports = function(options) {
  var router = express.Router();
  var join = path.join;
  var notesPath = options.notesPath;

  router.get('/', function(request, response) {
    async.waterfall([
      function(callback) {
        fs.readdir(notesPath, callback);
      },
      function(dirs, callback) {
        async.filter(dirs, function(dir, filterCallback) {
          fs.stat(join(notesPath, dir), function(error, stats) {
            return filterCallback(error, stats.isDirectory());
          });
        }, function(error, results) {
          callback(error, results);
        });
      },
      function(dirs, callback) {
        var hierarchy = {};
        async.map(dirs, function(dir, mapCallback) {
          fs.readdir(join(notesPath, dir, 'output'), function(error, files) {
            hierarchy[dir] = files.filter(function(file) {
              return file.indexOf('.pdf') > 0;
            }).map(function(current, index, array) {
              return '/' + join(notesPath, dir, 'output', current);
            });
            return mapCallback(error);
          });
        }, function(error, results) {
          callback(error, hierarchy);
        });
      }
    ], function(error, results) {
      if (error) {
        alert('omgimanerd.tech - Error', error, function(error, response) {
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
   * This route handles the request from GitHub when the rit-notes repository
   * receives a push.
   */
  router.post('/update', function(request, response) {
    var match = bufferEqual(new Buffer(request.receivedHash),
                            new Buffer(request.computedHash));
    if (typeof(request.receivedHash) == 'string' &&
        typeof(request.computedHash) == 'string' && match) {
      shellJs.config.silent = true;
      shellJs.pushd('./');
      shellJs.cd(notesPath);
      shellJs.exec('git pull');
      shellJs.popd();
    }
    response.send(null);
  });

  return router;
};
