/**
 * @fileoverview This is the server app script.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const NOTES_PATH = './client/rit-notes/latex'
const PORT = process.env.PORT || 5000
const PROD_MODE = process.argv.includes('--prod')

// Dependencies.
const Promise = require('bluebird')
const express = require('express')
const fs = Promise.promisifyAll(require('fs'))
const http = require('http')
const path = require('path')

const analyticsFile = path.join(__dirname, 'logs/analytics.log')
const errorFile = path.join(__dirname, 'logs/error.log')

const loggers = require('./server/loggers')({
  PROD_MODE, analyticsFile, errorFile
})
const logError = loggers.logError

const app = express()
const server = http.Server(app)

// Routers
const routerOptions = {
  prodMode: PROD_MODE,
  notesPath: NOTES_PATH,
  logError: logError
}
const baseRouter = require('./server/baseRouter')(routerOptions)
const notesRouter = require('./server/notesRouter')(routerOptions)

app.set('port', PORT)
app.set('view engine', 'pug')
app.use('/favicon.ico', express.static(path.join(__dirname,
  '/client/img/alpha.png')))
app.use('/client', express.static(path.join(__dirname, '/client')))
app.use('/dist', express.static(path.join(__dirname, '/dist')))

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
server.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`STARTING SERVER ON PORT ${PORT}`)
  if (PROD_MODE) {
    console.log('DEPLOYING IN PRODUCTION MODE!')
  }
  if (!process.env.GITHUB_WEBHOOK_SECRET) {
    throw new Error('No Github webhook secret specified!')
  }
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('No SendGrid API key specified!')
  }
  fs.accessAsync(path.join(__dirname, NOTES_PATH)).then(error => {
    if (error) {
      throw new Error('Unable to access notes!')
    }
  })
  /* eslint-enable no-console */
})
