/**
 * @fileoverview This file contains the router that will handle the homepage.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const express = require('express')

const config = require('../config')
const renderData = require('./data')

const router = express.Router()

router.get('/', (request, response) => {
  response.render('index', { renderData })
})

router.post('/message', (request, response) => {
  if (config.PRODUCTION) {
    setTimeout(() => {
      response.send({
        error: 'blah',
        result: null
      })
    }, 2500)
  } else {
    /**
     * The POST request must contain three fields:
     * email - The sender email that we can reply to.
     * name - The name of the person.
     * message - The message content.
     */
    const sender = request.body.email
    let name = request.body.name
    const message = request.body.message
    if (!sender || !name || !message) {
      response.send({
        error: 'One of your message fields was blank!',
        result: null
      })
    } else {
      name = `omgimanerd.tech - Message from ${name}`
      // alert.alert(name, message, error => {
      //   response.send({ error })
      // })
    }
  }
})

module.exports = exports = router
