/**
 * @fileoverview This file contains the base routes for the homepage and
 *   general handling.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var express = require('express');

var renderData = require('../shared/data');

/**
 * Defines the router that will be used to handle the homepage.
 * @param {Object} options Options that modify the behavior of the router.
 * @return {express.Router}
 */
module.exports = function(options) {
  var router = express.Router();

  router.get('/', function(request, response) {
    response.render('index', {
      dev_mode: options.dev_mode,
      renderData: renderData
    });
  });

  router.post('/message', function(request, response) {
    if (options.dev_mode) {
      setTimeout(function() {
        response.send({
          error: 'blah',
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
      } else {
        options.email({
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
    }
  });

  router.use(function(request, response) {
    response.status(404).render('error', {
      error: '404: Page not found!'
    });
  });

  return router;
};
