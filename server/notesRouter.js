/**
 * @fileoverview This file contains the router that handles access to the
 *   LaTeX notes.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const express = require('express')
const githubWebhook = require('github-webhook-middleware')

const config = require('../config')
const loggers = require('./loggers')
const notes = require('./notes')

/**
 * Fetches and stores the analytics data for caching.
 * @return {Promise}
 */
// const getAnalytics = () => {
//   return fs.readFileAsync(config.ANALYTICS_LOG, 'utf-8').then(data => {
//     if (!data) {
//       return []
//     }
//     return data.trim().split('\n').map(JSON.parse)
//   })
// }

/**
 * TODO: Refactor the caches so they're not part of the router file
 */
// let analyticsCache = null
// let analyticsExpirationTime = 0

const router = express.Router()

router.get('/', (request, response) => {
  notes.getNotes().then(data => {
    response.render('notes', { notes: data })
  })
})

// router.post('/analytics', (request, response) => {
//   const currentTime = Date.now()
//   if (analyticsCache && analyticsExpirationTime > currentTime) {
//     response.send(analyticsCache)
//   } else {
//     getAnalytics().then(data => {
//       analyticsCache = data
//       analyticsExpirationTime = currentTime + 600000
//       response.send(data)
//     })
//   }
// })

router.use('/latex', loggers.analyticsLoggerMiddleware)

router.use('/latex', express.static(config.NOTES_PATH))

/**
 * This route handles the request from GitHub when the rit-notes repository
 * receives a push.
 */
const middleware = githubWebhook({
  secret: config.GITHUB_WEBHOOK_SECRET
})
router.post('/update', middleware, (request, response) => {
  if (request.headers['x-github-event'] === 'push') {
    notes.updateNotes().then(() => {
      response.send('OK')
    }).catch(error => {
      loggers.logError(error)
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
  if (!config.PRODUCTION) {
    notes.updateNotes().then(() => {
      response.redirect('/notes')
    }).catch(error => {
      response.status(500).send(error)
    })
  } else {
    response.redirect('/notes')
  }
})

module.exports = exports = router
