/**
 * @fileoverview This library file takes care of sending an alert to my email
 *   using the SendGrid API.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const FROM_EMAIL = 'alert@omgimanerd.tech';
const TO_EMAIL = 'alvin.lin.dev@gmail.com';

var sendgrid = require('sendgrid');

/**
 * Defines the router that will be used to handle access to the LaTeK notes.
 * @param {string} subject The subject header of the email alert to send.
 * @param {string} content The subject content of the email alert to send.
 * @param {string} apiKey The SendGrid API key.
 * @param {function()} callback The callback function for the SendGrid API
 *   request.
 */
module.exports = function(subject, content, apiKey, callback) {
  var helper = sendgrid.mail;
  var mail = new helper.Mail(new helper.Email(FROM_EMAIL), subject,
                             new helper.Email(TO_EMAIL),
                             new helper.Content('text/plain', content));
  sendgrid(apiKey).API(sendgrid(apiKey).emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  }), callback);
};
