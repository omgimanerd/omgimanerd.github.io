/**
 * @fileoverview Fucking router for gov hw
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var express = require('express');

module.exports = function() {
  var router = express.Router();

  router.get('/', function(request, response) {
    response.render('gov.html');
  });

  return router;
};
