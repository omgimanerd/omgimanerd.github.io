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

const CLIENT_PATH = path.join(__dirname, 'client')
const FAVICON_PATH = path.join(CLIENT_PATH, 'img/alpha.png')
const LOGS_PATH = path.join(__dirname, 'logs')
const NODE_MODULES_PATH = path.join(__dirname, 'node_modules')

const ANALYTICS_LOG = path.join(LOGS_PATH, 'analytics.log')
const ERROR_LOG = path.join(LOGS_PATH, 'error.log')

const NOTES_PATH = path.join(__dirname, process.env.NOTES_PATH || '')
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET

if (process.env.PROJECT !== 'omgimanerd.tech') {
  throw new Error('Missing environment variables!')
}

fs.access(CLIENT_PATH, CONST_AVAILABLE, error => {
  if (error) {
    throw new Error('Unable to access /client, maybe reclone the project?')
  }
})

fs.access(LOGS_PATH, CONST_AVAILABLE, error => {
  if (error) {
    throw new Error('Unable to access /logs, remember to make the folder.')
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
  CLIENT_PATH,
  FAVICON_PATH,
  NODE_MODULES_PATH,
  ANALYTICS_LOG,
  ERROR_LOG,
  NOTES_PATH,
  GITHUB_WEBHOOK_SECRET
}
