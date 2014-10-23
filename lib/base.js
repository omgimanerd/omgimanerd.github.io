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

function absDistance(p1, p2) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
};

function refreshCookieExpirationDate() {
  // Get and set the cookie expiration date to a year from now.
  var date = new Date();
  var expirationDate = date.getTime() + 1000 * 3600 * 24 * 365;
  date.setTime(expirationDate);

  document.cookie += ';path=/;expires=' + date.toUTCString();
};

function getValueFromCookie(key) {
  var keyValues = document.cookie.split(';');
  for (var i = 0; i < keyValues.length; ++i) {
    if (keyValues[i].indexOf(key) != -1) {
      return keyValues[i].split('=')[1];
    }
  }
  return null;
};

function setValueInCookie(key, value) {
  if (document.cookie == '') {
    document.cookie = key + '=' + value;
  } else if (getValueFromCookie(key) === null) {
    document.cookie += ';' + key + '=' + value;
  } else {
    document.cookie = document.cookie.replace(
      key + '=' + getValueFromCookie(key),
      key + '=' + value);
  }
  refreshCookieExpirationDate();
};
