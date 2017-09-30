/**
 * @fileoverview This file contains the router that handles access to the
 *   LaTeX notes.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const _ = require('lodash')
const Promise = require('bluebird')
const express = require('express')
const fs = require('fs')
const githubWebhook = require('github-webhook-middleware')
const path = require('path')

const exec = Promise.promisify(require('child_process').exec)

const config = require('../config')
const loggers = require('./loggers')

/**
 * Invokes the commands in the notes directory to pull and update the notes.
 * @return {Promise}
 */
const updateNotes = () => {
  return exec('git pull', { cwd: config.NOTES_PATH }).then(() => {
    return exec('gulp clean', { cwd: config.NOTES_PATH })
  }).then(() => {
    return exec('gulp latex', { cwd: config.NOTES_PATH })
  })
}

/**
 * Given the class directory and the tex file name, this function returns
 * the path to file relative to the root.
 * @param {string} directory The class directory name
 * @param {string} file The tex file name
 * @return {string}
 */
const formatFilePath = (directory, file) => {
  return path.join(
    'notes/latex', directory, 'output', file.replace('.tex', '.pdf'))
}

const notesCache = {}

const router = express.Router()

router.get('/', (request, response) => {
  fs.readdirAsync(config.NOTES_PATH).then(dirs => {
    return Promise.all(dirs.map(dir => {
      const dirPath = path.join(config.NOTES_PATH, dir)
      return fs.readdirAsync(dirPath).then(files => {
        return files.filter(file => file.endsWith('.tex'))
          .map(file => formatFilePath(dir, file))
      }).then(data => {
        return { [dir]: data }
      })
    })).reduce(_.merge)
  }).then(hierarchy => {
    response.render('notes', { notes: hierarchy })
  }).catch(error => {
    loggers.logError(error)
    response.render('error', {
      error: 'There was an error fetching the notes! Try again later!'
    })
  })
})

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
    updateNotes().then(() => {
      response.send('OK')
    }).catch(error => {
      loggers.logError(error)
      response.status(500).send('Something broke!')
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
    updateNotes(error => {
      if (error) {
        response.send(error)
      } else {
        response.send('Update complete!')
      }
    })
  } else {
    response.redirect('/notes')
  }
})

module.exports = exports = router
