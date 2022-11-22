/**
 * @fileoverview This file contains the router that handles access to the
 *   LaTeX notes.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

import express from 'express';
import githubWebhook from 'github-webhook-middleware';

import config from '../config.js';
import notes from './notes.js';

const router = express.Router()

const githubMiddleware = githubWebhook({
  secret: config.GITHUB_WEBHOOK_SECRET
})

router.get('/', (request, response) => {
  notes.getNotes().then(data => {
    response.render('notes', { notes: data })
  })
})

router.use('/latex', express.static(config.NOTES_PATH))

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
    }).catch(() => {
      response.status(500).send('Something failed!')
    })
  } else {
    response.status(200).end()
  }
})

export default router;
