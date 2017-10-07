/**
 * @fileoverview Client side script for notes rendering.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

require('./base')

const $ = require('jquery')
// eslint-disable-next-line no-unused-vars
const Materialize = require('materialize-css')

$(document).ready(() => {
  $('#notes-modal').modal('open')
})
