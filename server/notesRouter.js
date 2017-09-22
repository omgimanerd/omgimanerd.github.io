/**
 * @fileoverview This file contains the router that handles access to the
 *   LaTeX notes.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

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
  const alert = options.alert
  const devMode = options.devMode
  const notesPath = options.notesPath

  const join = path.join
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
      console.log(dirs)
    })
    response.send(0);
    // async.waterfall([
    //   function(callback) {
    //     fs.readdir(notesPath, callback)
    //   },
    //   function(dirs, callback) {
    //     async.filter(dirs, (dir, filterCallback) => {
    //       fs.stat(join(notesPath, dir), (error, stats) => {
    //         return filterCallback(error, stats.isDirectory())
    //       })
    //     }, (error, results) => {
    //       callback(error, results)
    //     })
    //   },
    //   function(dirs, callback) {
    //     const hierarchy = {}
    //     async.map(dirs, (dir, mapCallback) => {
    //       fs.readdir(join(notesPath, dir), (error, files) => {
    //         if (error) {
    //           return mapCallback(error)
    //         }
    //         hierarchy[dir] = files.filter(file => {
    //           return file.includes('.tex')
    //         }).map((current, index, array) => {
    //           current = current.replace('.tex', '.pdf')
    //           return `/${join(notesPath, dir, 'output', current)}`
    //         })
    //         return mapCallback(error)
    //       })
    //     }, (error, results) => {
    //       callback(error, hierarchy)
    //     })
    //   }
    // ], alert.errorHandler((error, results) => {
    //   if (error) {
    //     response.status(500).render('error', {
    //       error: 'An error occurred. This has been logged. Try again later.'
    //     })
    //   } else {
    //     response.render('notes', {
    //       devMode: devMode,
    //       notes: results
    //     })
    //   }
    // }))
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
