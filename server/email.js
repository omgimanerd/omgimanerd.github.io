/**
 * @fileoverview This file externalizes the functions that invoke the SendGrid
 * API to send emails.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const sendgrid = require('sendgrid')

const config = require('../config')

const sg = sendgrid(config.SENDGRID_API_KEY)

/**
 * Given a recipient, sender, and content data, this method sends an email out
 * to the given email via the SendGrid API.
 * @param {string} recipient The recipient email
 * @param {string} sender The sender email
 * @param {string} content The content of the email
 * @return {Promise}
 */
const email = (recipient, sender, content) => {
  return sg.API(sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [{
        to: [{ email: recipient }],
        subject: 'Error from getnews.tech'
      }],
      from: { email: sender },
      content: [{
        type: 'text/plain',
        value: content
      }]
    }
  }))
}

module.exports = exports = email
