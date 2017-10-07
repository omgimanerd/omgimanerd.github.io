/**
 * @fileoverview Client side script for notes rendering.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

require('./base')

const $ = require('jquery')
// eslint-disable-next-line no-unused-vars
const Materialize = require('materialize-css')

$(document).ready(() => {
  $('#notes-modal').modal({
    dismissible: false,
    opacity: 0.75,
    inDuration: 100,
    outDuration: 100
  }).modal('open')
})
