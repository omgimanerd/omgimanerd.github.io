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

