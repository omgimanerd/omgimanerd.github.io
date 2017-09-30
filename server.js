/**
 * @fileoverview This is the server app script.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

// Dependencies.
const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const path = require('path')

const config = require('./config')

const loggers = require('./server/loggers')
const logError = loggers.logError

const app = express()
const server = http.Server(app)

// Routers
const baseRouter = require('./server/baseRouter')
const notesRouter = require('./server/notesRouter')

app.set('port', config.PORT)
app.set('view engine', 'pug')
app.disable('etag')
app.use('/favicon.ico', express.static(path.join(__dirname,
  '/client/img/alpha.png')))
app.use('/client', express.static(path.join(__dirname, '/client')))
app.use('/dist', express.static(path.join(__dirname, '/dist')))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(loggers.devLoggerMiddleware)

app.use('/', baseRouter)
app.use('/notes', notesRouter)

app.use((request, response) => {
  response.status(404).render('error', {
    error: '404: Page not found!'
  })
})

// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
  logError(request)
  logError(error)
  response.status(500).render('error', {
    error: '500: Internal error!'
  })
})

// Starts the server.
server.listen(config.PORT, () => {
  /* eslint-disable no-console */
  console.log(`STARTING SERVER ON PORT ${config.PORT}`)
  if (config.PRODUCTION) {
    console.log('DEPLOYING IN PRODUCTION MODE!')
  }
  /* eslint-enable no-console */
})
