/**
 * @fileoverview Fucking router for gov hw
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var express = require('express');

module.exports = function(options) {

  var router = express.Router();

  var dev_mode = options.dev_mode;

  router.get('/', function(request, response) {
    console.log('called');
    response.render('gov.html', {
      dev_mode: dev_mode
    });
  });

  return router;
};
