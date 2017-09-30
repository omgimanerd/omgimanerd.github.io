/**
 * @fileoverview Client side script for homepage initialization.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

require('./base')

const $ = require('jquery')
const Materialize = require('materialize-css')

$(document).ready(() => {
  $('.button-collapse').sideNav()
  $('.modal').modal()
  $('.parallax').parallax()
  $('.scrollspy').scrollSpy()

  Materialize.scrollFire([{
    selector: '#skills',
    offset: 350,
    callback: function() {
      Materialize.showStaggeredList('#skills ul')
    }
  }])
})
