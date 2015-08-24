/**
 * This file contains base functions necessary for maintaining homeostasis.
 * Just kidding, these are just useful functions.
 * Taken from SchoolYourself. heheheh
 */

function bind(object, method) {
  return function() {
    return method.apply(object, arguments);
  };
}

function generateRandomAlphaNum(length) {
  var choice = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  var result = "";
  for (var i = 0; i < length; ++i) {
    result += choice[Math.floor(Math.random() * choice.length)]
  }
  return result;
};
