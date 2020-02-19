/**
 * @fileoverview This file contains the router that handles access to the
 *   LaTeX notes.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const express = require('express')
const githubWebhook = require('github-webhook-middleware')

const config = require('../config')

const notes = require('./notes')

const router = express.Router()

const githubMiddleware = githubWebhook({
  secret: config.GITHUB_WEBHOOK_SECRET
})

router.get('/', (request, response) => {
  notes.getNotes().then(data => {
    response.render('notes', { notes: data })
  })
})

router.use('/latex', express.static('rit/latex'))

/**
 * This route handles the request from GitHub when the rit-notes repository
 * receives a push.
 */
router.post('/update', githubMiddleware, (request, response) => {
  if (request.headers['x-github-event'] === 'push') {
    notes.updateNotes().then(() => {
      notes.getNotes().then(data => {
        response.send(data)
      })
    }).catch(error => {
      /* eslint-disable no-console */
      console.error(error)
      /* eslint-enable no-console */
      response.status(500).send('Something failed!')
    })
  } else {
    response.status(200).end()
  }
})

/**
 * If we are not in production, then an update can be forced through the
 * /update route.
 */
router.get('/update', (request, response) => {
  if (!config.IS_PRODUCTION) {
    notes.updateNotes().then(() => {
      response.redirect('/notes')
    }).catch(error => {
      /* eslint-disable no-console */
      console.error(error)
      /* eslint-enable no-console */
      response.status(500).send(error)
    })
  } else {
    response.redirect('/notes')
  }
})

module.exports = exports = router
