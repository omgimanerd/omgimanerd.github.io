/**
 * @fileoverview This file contains the router that will handle the homepage.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const express = require('express')

const renderData = require('./data')

const router = express.Router()

router.get('/', (request, response) => {
  response.render('index', { renderData })
})

module.exports = exports = router
