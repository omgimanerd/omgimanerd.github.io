/**
 * @fileoverview Client side script for layout.pug
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

$(document).ready(function() {
  $('#notes-modal').modal('open');

  $('.collapsible-header').each(function(index, element) {
    var parts = element.textContent.split('_');
    var label = parts[0].toUpperCase().replace('-', ' ') + ': ';
    var className = parts[1].split('-').map(function(current) {
      return current.charAt(0).toUpperCase() + current.slice(1);
    }).join(' ');
    element.innerHTML = label + className;
  });
  $('.collapsible-body a').each(function(index, element) {
    var parts = element.textContent.split('/');
    element.innerHTML = parts[parts.length - 1];
  });
});
