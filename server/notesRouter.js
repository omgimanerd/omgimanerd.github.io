/**
 * @fileoverview This file contains the router that handles access to the
 *   LaTeX notes.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const _ = require('lodash')
const Promise = require('bluebird')
const express = require('express')
const fs = require('fs')
const path = require('path')

const exec = Promise.promisify(require('child_process').exec)

/**
 * Defines the router that will be used to handle access to the LaTeK notes.
 * @param {Object} options Options that modify the behavior of the router.
 * @return {express.Router}
 */
module.exports = function(options) {
  const notesPath = options.notesPath
  const logError = options.logError

  const router = express.Router()

  const updateNotes = () => {
    return exec('git pull', { cwd: notesPath }).then(() => {
      return exec('gulp clean', { cwd: notesPath })
    }).then(() => {
      return exec('gulp latex', { cwd: notesPath })
    })
  }

  router.get('/', (request, response) => {
    fs.readdirAsync(notesPath).then(dirs => {
      return Promise.all(dirs.map(dir => {
        const dirPath = path.join(notesPath, dir)
        return fs.readdirAsync(dirPath).then(files => {
          return files.filter(file => file.endsWith('.tex'))
            .map(file => {
              return path.join(notesPath, dir, 'output', file)
            })
        }).then(data => {
          return { [dir]: data }
        })
      })).reduce(_.merge)
    }).then(hierarchy => {
      response.render('notes', { notes: hierarchy })
    }).catch(error => {
      logError(error)
      response.render('error', {
        error: 'There was an error fetching the notes! Try again later!'
      })
    })
  })

  /**
   * This route handles the request from GitHub when the rit-notes repository
   * receives a push.
   */
  // router.post('/update', (request, response) => {
  //   const match = bufferEqual(new Buffer(request.receivedHash),
  //     new Buffer(request.computedHash))
  //   if (typeof request.receivedHash === 'string' &&
  //       typeof request.computedHash === 'string' && match) {
  //     response.send({
  //       success: true
  //     })
  //     updateNotes()
  //   } else {
  //     response.send({
  //       success: false,
  //       error: 'Invalid hash'
  //     })
  //   }
  // })

  /**
   * If development mode is enabled, then an update can be forced through the
   * /update route.
   */
  // router.get('/update', (request, response) => {
  //   if (devMode) {
  //     updateNotes(error => {
  //       if (error) {
  //         console.error('error')
  //         response.send(error)
  //       } else {
  //         response.send('Update complete!')
  //       }
  //     })
  //   } else {
  //     response.redirect('/notes')
  //   }
  // })

  return router
}
