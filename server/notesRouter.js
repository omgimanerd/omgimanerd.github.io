/**
 * @fileoverview This file contains the router that handles access to the
 *   LaTeX notes.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const _ = require('lodash')
const Promise = require('bluebird')
const express = require('express')
const fs = Promise.promisifyAll(require('fs'))
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
 * Given a latex file directory name, this function separates out the parts by
 * delimiter and formats it into a displayable format.
 * @param {string} directory The class directory name
 * @return {string}
 */
const formatClassName = directory => {
  const parts = directory.split('_')
  const label = `${parts[0].toUpperCase().replace('-', ' ')}: `
  const className = parts[1].split('-').map(_.capitalize).join(' ')
  return label + className
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

/**
 * Fetches and creates the hierarchy of notes for caching. This is invoked
 * during server startup and the internal cache is updated each time the notes
 * update endpoint is hit.
 * @return {Promise}
 */
const getNotes = () => {
  // Iterate through each directory in the latex folder.
  return fs.readdirAsync(config.NOTES_PATH).then(directories => {
    // For each directory
    return Promise.all(directories.map(directory => {
      const dirPath = path.join(config.NOTES_PATH, directory)
      // Read the names of all the files in the directory
      return fs.readdirAsync(dirPath).then(files => {
        /**
         * Filter out all the .tex files and infer the names of all the
         * .pdf files. Return an object which the template will use to
         * render the expandable accordion.
         */
        return files.filter(file => file.endsWith('.tex')).map(file => {
          return {
            filename: file,
            path: formatFilePath(directory, file)
          }
        })
      }).then(data => {
        return { [formatClassName(directory)]: data }
      })
    })).reduce(_.merge)
  })
}

/**
 * Fetches and stores the analytics data for caching.
 * @return {Promise}
 */
const getAnalytics = () => {
  return fs.readFileAsync(config.ANALYTICS_LOG, 'utf-8').then(data => {
    if (!data) {
      return []
    }
    return data.trim().split('\n').map(JSON.parse)
  })
}

/**
 * Populate the caches when we first start the server. Unless something scary
 * occurs, these Promises should always be fulfilled when we need their data
 * during a request.
 */
let analyticsCache = getAnalytics()
let notesCache = getNotes()

const router = express.Router()

router.get('/', (request, response) => {
  if (notesCache.isFulfilled()) {
    response.render('notes', { notes: notesCache.value() })
  } else {
    notesCache.then(data => {
      response.render('notes', { notes: data })
    })
  }
})

router.post('/analytics', (request, response) => {
  if (analyticsCache.isFulfilled()) {
    response.send(analyticsCache.value())
  } else {
    analyticsCache.then(data => {
      response.send(data)
    })
  }
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
    notesCache = getNotes()
    response.send('OK')
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
