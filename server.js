/**
 * @fileoverview This is the server app script.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

// Important globals
const ALERT_RECEIVER_EMAIL = process.env.ALERT_RECEIVER_EMAIL
const ALERT_SENDER_EMAIL = process.env.ALERT_SENDER_EMAIL
const NOTES_PATH = './client/rit-notes/latex'
const PORT = process.env.PORT || 5000

const DEV_MODE = process.argv.includes('--dev')

// Dependencies.
const exec = require('child_process').exec
const express = require('express')
const http = require('http')
const path = require('path')

// Initialization.
const app = express()
const server = http.Server(app)

// Routers
const routerOptions = {
  devMode: DEV_MODE,
  notesPath: NOTES_PATH
}
const baseRouter = require('./routers/baseRouter')(routerOptions)
// const notesRouter = require('./routers/notesRouter')(routerOptions)

app.set('port', PORT)
app.set('view engine', 'pug')
app.use('/favicon.ico', express.static(path.join(__dirname,
  '/client/img/alpha.png')))
app.use('/client', express.static(path.join(__dirname, '/client')))

app.use('/', baseRouter)
// app.use('/notes', notesRouter)
app.use((request, response) => {
  response.status(404).render('error', {
    error: '404: Page not found!'
  })
})

// Starts the server.
server.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`STARTING SERVER ON PORT ${PORT}`)
  /**
   * The action to take when throw an error
   * @param {Object} error The error to throw or show
   */
  let errorAction = error => {
    throw new Error(error)
  }
  if (DEV_MODE) {
    console.log('DEVELOPMENT MODE ENABLED!')
    errorAction = console.warn
  }
  if (!process.env.GITHUB_WEBHOOK_SECRET) {
    errorAction('No Github webhook secret specified!')
  }
  if (!process.env.SENDGRID_API_KEY) {
    errorAction('No SendGrid API key specified!')
  }
  exec('ls', {
    cwd: NOTES_PATH
  }, error => {
    if (error) {
      errorAction(error)
    }
  })
  /* eslint-enable no-console */
})
