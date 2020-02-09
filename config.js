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

const DIST_PATH = path.join(__dirname, 'dist')
const NOTES_PATH = path.join(__dirname, 'rit', 'latex')
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET

fs.access(DIST_PATH, CONST_AVAILABLE, error => {
  if (error) {
    throw new Error('Unable to access /dist, invoke gulp.')
  }
})

fs.access(NOTES_PATH, CONST_AVAILABLE, error => {
  if (error) {
    throw new Error('Unable to access /notes, please clone the notes repo.')
  }
})

module.exports = exports = {
  PORT,
  DIST_PATH,
  NOTES_PATH,
  GITHUB_WEBHOOK_SECRET
}
