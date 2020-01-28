/**
 * @fileoverview This file contains global constants needed on the server. It
 * performs necessary checks to assure the validity of the environment
 * configuration.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const fs = require('fs')
const path = require('path')

const CONST_AVAILABLE =
  fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK

const PORT = process.env.PORT || 5000
const IS_PRODUCTION = process.argv.includes('--prod')

const DIST_PATH = path.join(__dirname, 'dist')
const FAVICON_PATH = path.join(DIST_PATH, 'img/alpha.png')

const NOTES_PATH = path.join(__dirname, process.env.NOTES_PATH || '')
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET

if (process.env.PROJECT !== 'omgimanerd.tech') {
  throw new Error('Missing environment variables!')
}

fs.access(DIST_PATH, CONST_AVAILABLE, error => {
  if (error) {
    throw new Error('Unable to access /client, maybe reclone the project?')
  }
})

fs.access(NOTES_PATH, CONST_AVAILABLE, error => {
  if (error) {
    throw new Error('Unable to access /notes, please clone the notes repo.')
  }
})

module.exports = exports = {
  PORT,
  IS_PRODUCTION,
  DIST_PATH,
  FAVICON_PATH,
  NOTES_PATH,
  GITHUB_WEBHOOK_SECRET
}
