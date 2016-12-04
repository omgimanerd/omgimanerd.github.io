/**
 * @fileoverview This file provides the necessary externs for the project when
 *   compiling with Google's Closure Compiler.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var jQuery = {};

jQuery.prototype.modal = function(arg) {};

jQuery.prototype.parallax = function() {};

jQuery.prototype.scrollSpy = function() {};

jQuery.prototype.sideNav = function() {};

var Materialize = {};

/**
 * @param {string} text
 * @param {?number=} duration
 * @param {?string=} style
 * @param {?function()=} callback
 */
Materialize.toast = function(text, duration, style, callback) {};

/**
 * @param {Object} options
 */
Materialize.scrollFire = function(options) {};

/**
 * @param {string} selector
 */
Materialize.showStaggeredList = function(selector) {};
