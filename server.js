/**
 * @fileoverview This is the server app script.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

import express from 'express'
import http from 'http'
import morgan from 'morgan'

import config from './config.js'

import notesRouter from './server/notesRouter.js'

const app = express()
const server = http.Server(app)

app.set('port', config.PORT)
app.set('view engine', 'pug')

app.use('/dist', express.static('dist'))
app.use('/node_modules', express.static('node_modules'))

app.use(morgan('combined'))

app.get('/', (_, response) => {
  response.render('index')
})

app.use('/notes', notesRouter)

app.use((_, response) => {
  response.status(404).render('error', {
    error: '404: Page not found!'
  })
})

app.use((error, _, response, __) => {
  console.error(error)
  response.status(500).render('error', {
    error: '500: Internal error!'
  })
})

// Starts the server.
server.listen(config.PORT, () => {
  console.log(`STARTING SERVER ON PORT ${config.PORT}`)
})
