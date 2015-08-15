/**
 * This file contains base functions necessary for maintaining homeostasis.
 * Just kidding, these are just useful functions.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

function bind(object, method) {
  return function() {
    return method.apply(object, arguments);
  };
}

