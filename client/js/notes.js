/**
 * @fileoverview Client side script for layout.pug
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const $ = require('jquery')

$(document).ready(() => {
  $('#notes-modal').modal('open')

  $('.collapsible-header').each((index, element) => {
    const parts = element.textContent.split('_')
    const label = `${parts[0].toUpperCase().replace('-', ' ')}: `
    const className = parts[1].split('-').map(current => {
      return current.charAt(0).toUpperCase() + current.slice(1)
    }).join(' ')
    element.innerHTML = label + className
  })
  $('.collapsible-body a').each((index, element) => {
    const parts = element.textContent.split('/')
    element.innerHTML = parts[parts.length - 1]
  })
})
