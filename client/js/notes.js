/* globals $ */
/**
 * @fileoverview Client side script for notes rendering.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

$(document).ready(() => {
  $('#notes-modal').modal({
    dismissible: false,
    opacity: 0.75,
    inDuration: 100,
    outDuration: 100
  }).modal('open')
})
