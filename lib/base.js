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

function getCookieExpirationDate() {
  // Get the cookie expiration date to a year from now.
  var date = new Date();
  var expirationDate = date.getTime() + 1000 * 3600 * 24 * 365;
  date.setTime(expirationDate);

  return ';path=/;expires=' + date.toUTCString() + ';';
};

function eraseCookie() {
  document.cookie = ';expires=-1;';
};

function setValueInCookie(key, value) {
  document.cookie += key + '=' + value + getCookieExpirationDate();
};

function getValueInCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
