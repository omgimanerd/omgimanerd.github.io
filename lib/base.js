// Copyright Alvin Lin 2014
/**
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * Some basic functions used throughout the website, necessary
 * for overall function or shortening of code.
 */

// bind() function allows setTimeout to work on non-static objects.
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

function getValueFromCookie(value) {
  var keyValues = document.cookie.split(';');
  for (var i = 0; i < keyValues.length; ++i) {
    if (keyValues[i].indexOf(value) != -1) {
      return keyValues[i].split('=')[1];
    }
  }
  return null;
};

function replaceValueInCookie(key, newvalue) {
  if(getValueFromCookie(key) !== null) {
    document.cookie = document.cookie.replace(
      key + '=' + getValueFromCookie(key),
      key + '=' + newvalue);
  }
}
