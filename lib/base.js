// Copyright Alvin Lin 2014
/**
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * Some basic functions used throughout the website, necessary
 * for overall function or shortening of code.
 */

// bind() function allows setTimeout to work on the objects.
function bind(object, method) {
  return function() {
    return method.apply(object, arguments);
  };
}

function isChildOf(parent, child) {
  var children = parent.childNodes;
  for (var i = 0; i < children.length; ++i) {
    if (children[i] == child) {
      return true;
    }
  }
  return false;
};
