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

function getCookieExpirationDate() {
  // Get the date a year from now.
  var date = new Date();
  var expirationDate = date.getTime() + 1000 * 3600 * 24 * 365;
  date.setTime(expirationDate);

  return ';path=/;expires=' + date.toUTCString() + ';';
};

function eraseCookie() {
  // Erase the cookie by setting the expiration date to a time
  // before the present.
  var date = new Date();
  var expirationDate = date.getTime() - 1;
  date.setTime(expirationDate);
  document.cookie = ';path=/;expires=' + date.toUTCString() + ';';
};

function setValueInCookie(key, value) {
  var keyvalues = {
      'tapHighScore' : getValueInCookie('tapHighScore'),
      'klickHighScore' : getValueInCookie('klickHighScore')};
  keyvalues[key] = value;
  var cookieString = 'siteData=' + JSON.stringify(keyvalues) +
      getCookieExpirationDate();

  eraseCookie();
  document.cookie = cookieString;
};

function getValueInCookie(key) {
  if (document.cookie == '') {
    return 0;
  }
  var siteData = document.cookie.split('=')[1];
  siteData = siteData.substr(0, siteData.length);
  var keyvalues = JSON.parse(siteData);
  return keyvalues[key];
};
