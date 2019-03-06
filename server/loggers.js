/**
 * @fileoverview This file exports loggers for the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const expressWinston = require('express-winston')
const fs = require('fs')
const winston = require('winston')
const util = require('util')

const config = require('../config')

// eslint-disable-next-line no-unused-vars, require-jsdoc
const dynamicMetaFunction = (request, response) => {
  return {
    ip: request.headers['x-forwarded-for'] || request.ip
  }
}

const analyticsFileStream = fs.createWriteStream(config.ANALYTICS_LOG, {
  flags: 'a'
})
const errorFileStream = fs.createWriteStream(config.ERROR_LOG, {
  flags: 'a'
})

const errorLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      prettyPrint: true,
      timestamp: true
    }),
    new winston.transports.File({
      stream: errorFileStream,
      timestamp: true
    })
  ]
})

module.exports = exports = {
  analyticsLoggerMiddleware: expressWinston.logger({
    transports: [
      new winston.transports.File({
        json: true,
        showLevel: false,
        stream: analyticsFileStream,
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
  }
}
