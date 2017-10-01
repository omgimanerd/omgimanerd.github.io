/**
 * @fileoverview Client side script for layout.pug
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

require('./base')

const $ = require('jquery')
// eslint-disable-next-line no-unused-vars
const d3 = require('d3')
// eslint-disable-next-line no-unused-vars
const c3 = require('c3')
// eslint-disable-next-line no-unused-vars
const Materialize = require('materialize-css')

$(document).ready(() => {
  $('.modal').modal()
  $('#notes-modal').modal('open')

  $.post('/notes/analytics', data => {
    console.log(data)
  })
})
