/* globals $, Materialize */
/**
 * @fileoverview Client side script for homepage initialization.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

$(document).ready(() => {
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
