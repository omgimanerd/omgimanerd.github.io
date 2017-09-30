/**
 * @fileoverview This file exports loggers for the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const expressWinston = require('express-winston')
const winston = require('winston')
const util = require('util')

const config = require('../config')
const email = require('./email')

// eslint-disable-next-line no-unused-vars, require-jsdoc
const dynamicMetaFunction = (request, response) => {
  return {
    ip: request.headers['x-forwarded-for'] || request.ip
  }
}

const errorLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      prettyPrint: true,
      timestamp: true
    }),
    new winston.transports.File({
      filename: config.ERROR_LOG,
      timestamp: true
    })
  ]
})

module.exports = exports = {
  analyticsLoggerMiddleware: expressWinston.logger({
    transports: [
      new winston.transports.File({
        json: true,
        filename: config.ANALYTICS_LOG,
        showLevel: false,
        timestamp: true
      })
    ],
    skip: (request, response) => response.statusCode !== 200,
    dynamicMeta: dynamicMetaFunction
  }),
  devLoggerMiddleware: expressWinston.logger({
    transports: [
      new winston.transports.Console({ showLevel: false, timestamp: true })
    ],
    expressFormat: true,
    colorize: true,
    dynamicMeta: dynamicMetaFunction
  }),
  logError: data => {
    const unpacked = util.inspect(data)
    errorLogger.error(unpacked)
    if (config.PRODUCTION) {
      email(config.ALERT_RECEIVER_EMAIL, config.ALERT_RECEIVER_EMAIL,
        unpacked).then(() => {
        errorLogger.info('Alert email successfully sent!')
      }).catch(() => {
        errorLogger.info('Alert email could not be sent!')
      })
    }
  }
}
