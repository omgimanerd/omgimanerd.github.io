/**
 * @fileoverview Client side script for layout.pug
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

require('./base')

const $ = require('jquery')
// eslint-disable-next-line no-unused-vars
const d3 = require('d3')
const c3 = require('c3')
// eslint-disable-next-line no-unused-vars
const Materialize = require('materialize-css')

$(document).ready(() => {
  $('.modal').modal()
  $('#notes-modal').modal('open')

  $.post('/notes/analytics', data => {
    const trafficChart = c3.generate({
      bindto: '#traffic',
      axis: {
        x: { padding: 0, type: 'timeseries' },
        y: { label: 'Requests', min: 0, padding: 0 }
      },
      data: {
        x: 'date',
        columns: data.traffic
      },
      points: { show: false },
      padding: { right: 25 }
    })
  })
})
