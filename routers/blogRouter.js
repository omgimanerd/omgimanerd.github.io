/**
 * @fileoverview This file contains the router that will handle the blog.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var express = require('express');

/**
 * Defines the router that will be used to handle the blog.
 * @param {Object} options Options that modify the behavior of the router.
 * @return {express.Router}
 */
module.exports = function(options) {
  var alert = options.alert;
  var dev_mode = options.dev_mode;

  var router = express.Router();

  router.get('/', function(request, response) {
    response.send(null);
  });

  return router;
};
