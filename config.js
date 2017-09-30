/**
 * @fileoverview This file contains global constants needed on the server. It
 * performs necessary checks to assure the validity of the environment
 * configuration.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const path = require('path')

const PORT = process.env.PORT || 5000
const PRODUCTION = process.argv.includes('--prod')

const ANALYTICS_LOG = path.join(__dirname, 'logs/analytics.log')
const ERROR_LOG = path.join(__dirname, 'logs/error.log')

const NOTES_PATH = path.join(__dirname, process.env.NOTES_PATH)
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET

const ALERT_RECEIVER_EMAIL = process.env.ALERT_RECEIVER_EMAIL
const ALERT_SENDER_EMAIL = process.env.ALERT_SENDER_EMAIL
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

if (!NOTES_PATH) {
  throw new Error('NOTES_PATH unspecified!')
}

if (PRODUCTION) {
  if (!ALERT_RECEIVER_EMAIL || !ALERT_SENDER_EMAIL || !SENDGRID_API_KEY) {
    throw new Error('Production configuration not provided!')
  }
}

module.exports = exports = {
  PORT,
  PRODUCTION,
  ANALYTICS_LOG,
  ERROR_LOG,
  NOTES_PATH,
  GITHUB_WEBHOOK_SECRET,
  ALERT_RECEIVER_EMAIL,
  ALERT_SENDER_EMAIL,
  SENDGRID_API_KEY
}
