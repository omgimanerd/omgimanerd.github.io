/**
 * This file contains base functions necessary for maintaining homeostasis.
 * Just kidding, these are just useful functions.
 */

/**
 * Binds a method to a context to run on.
 * @param {Object} object The context to bind to.
 * @param {function()} method The function to execute in that context
 * @return {function()}
 */
function bind(object, method) {
  return function() {
    return method.apply(object, arguments);
  };
}

/**
 * Returns a randomly generated sequence of alphanumeric characters.
 * @param {number} length The length of the sequence.
 * @return {string}
 */
function generateRandomAlphaNum(length) {
  var choice = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  var result = '';
  for (var i = 0; i < length; ++i) {
    result += choice[Math.floor(Math.random() * choice.length)];
  }
  return result;
}

/**
 * Returns a random number within a range.
 * @param {number} min The minimum number to generate, inclusive.
 * @param {number} max The maximum number to generate, exclusive.
 * @return {number}
 */
function randRange(min, max) {
  if (min >= max) {
    var swap = min;
    min = max;
    max = swap;
  }
  return (Math.random() * (max - min)) + min;
}

/**
 * Returns a random integer within a range.
 * @param {number} min The minimum integer to generate, inclusive.
 * @param {number} max The maximum integer to generate, exclusive.
 * @return {number}
 */
function randRangeInt(min, max) {
  if (min >= max) {
    var swap = min;
    min = max;
    max = swap;
  }
  return Math.floor(Math.random() * (max - min)) + min;
}
