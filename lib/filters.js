/**
 * @fileoverview This file contains necessary Pug filters.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var path = require('path');
var _ = require('lodash');

module.exports = {
  filename: function(text, options) {
    return path.basename(text);
  },
  beautifyTitle: function(text, options) {
    return _.startCase(text);
  }
};
