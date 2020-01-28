/**
 * @fileoverview This is the server app script.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

// Dependencies.
const express = require('express')
const http = require('http')
const morgan = require('morgan')

const config = require('./config')

const app = express()
const server = http.Server(app)

app.set('port', config.PORT)
app.set('view engine', 'pug')

app.use('/favicon.ico', express.static(config.FAVICON_PATH))
app.use('/dist', express.static(config.DIST_PATH))

app.use(morgan('combined'))

app.use('/', (request, response) => {
  response.render('index')
})

app.use((request, response) => {
  response.status(404).render('error', {
    error: '404: Page not found!'
  })
})

// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
  response.status(500).render('error', {
    error: '500: Internal error!'
  })
})

// Starts the server.
server.listen(config.PORT, () => {
  /* eslint-disable no-console */
  console.log(`STARTING SERVER ON PORT ${config.PORT}`)
  if (config.IS_PRODUCTION) {
    console.log('RUNNING IN PRODUCTION MODE!')
  } else {
    console.log('RUNNING IN DEV MODE!')
  }
  /* eslint-enable no-console */
})
