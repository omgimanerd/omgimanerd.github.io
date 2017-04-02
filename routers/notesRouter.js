/**
 * @fileoverview This file contains the router that handles access to the
 *   LaTeX notes.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var async = require('async');
var bufferEqual = require('buffer-equal-constant-time');
var exec = require('child_process').exec;
var express = require('express');
var fs = require('fs');
var path = require('path');

/**
 * Defines the router that will be used to handle access to the LaTeK notes.
 * @param {Object} options Options that modify the behavior of the router.
 * @return {express.Router}
 */
module.exports = function(options) {
  var alert = options.alert;
  var devMode = options.devMode;
  var notesPath = options.notesPath;

  var join = path.join;
  var router = express.Router();

  var updateNotes = function(done) {
    async.series([
      function(callback) {
        exec('git pull', { cwd: notesPath }, callback);
      },
      function(callback) {
        exec('gulp clean', { cwd: notesPath }, callback);
      },
      function(callback) {
        exec('gulp latex', { cwd: notesPath }, callback);
      }
    ], alert.errorHandler(done));
  };

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
          fs.readdir(join(notesPath, dir), function(error, files) {
            if (error) {
              return mapCallback(error);
            }
            hierarchy[dir] = files.filter(function(file) {
              return file.includes('.tex');
            }).map(function(current, index, array) {
              current = current.replace('.tex', '.pdf');
              return '/' + join(notesPath, dir, 'output', current);
            });
            return mapCallback(error);
          });
        }, function(error, results) {
          callback(error, hierarchy);
        });
      }
    ], alert.errorHandler(function(error, results) {
      if (error) {
        response.status(500).render('error', {
          error: 'An error occurred. This has been logged. Try again later.'
        });
      } else {
        response.render('notes', {
          devMode: devMode,
          notes: results
        });
      }
    }));
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
      response.send({
        success: true
      });
      updateNotes();
    } else {
      response.send({
        success: false,
        error: 'Invalid hash'
      });
    }
  });

  /**
   * If development mode is enabled, then an update can be forced through the
   * /update route.
   */
  router.get('/update', function(request, response) {
    if (devMode) {
      updateNotes(function(error) {
        if (error) {
          console.error('error');
          response.send(error);
        } else {
          response.send('Update complete!');
        }
      });
    } else {
      response.redirect('/notes');
    }
  });

  return router;
};
