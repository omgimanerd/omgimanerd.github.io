/**
 *
 */

function bind(object, method) {
  return function() {
    return method.apply(object, arguments);
  };
}

