/**
 * @fileoverview This is the server app script.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const PORT = 5000

// Dependencies.
const express = require('express')
const http = require('http')
const morgan = require('morgan')

const app = express()
const server = http.Server(app)

// Routers
const baseRouter = require('./server/baseRouter')
const notesRouter = require('./server/notesRouter')

app.set('port', PORT)
app.set('view engine', 'pug')

app.use(morgan('combined'))
app.use('/client', express.static('client'))
app.use('/node_modules', express.static('node_modules'))

app.use('/', baseRouter)
app.use('/notes', notesRouter)

app.use((request, response) => {
  response.status(404).render('error', {
    error: '404: Page not found!'
  })
})

// Starts the server.
server.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`STARTING SERVER ON PORT ${PORT}`)
  /* eslint-enable no-console */
})
