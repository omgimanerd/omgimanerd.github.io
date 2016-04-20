/**
 * @fileoverview This file provides the necessary externs for the project when
 *   compiling with Google's Closure Compiler.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var jQuery = {}

/**
 * @param {function(?, ?)} fn
 * @param {Object} options
 * @return {!jQuery}
 */
jQuery.prototype.terminal = function(fn, options) {}

var terminal = {
  echo: function() {},
  error: function() {},
  pause: function() {},
  resume: function() {}
};
