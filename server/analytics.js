/**
 * @fileoverview This file handles the fetching and caching of analytics data.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

const config = require('../config')

const CACHE_EXPIRATION_TIME = 1000 * 60 * 10

// Local cache
const cache = {}

/**
 * This function returns the analytics data. If the data requested has been
 * cached, then it returns the values stored in the cache. Otherwise, it
 * repopulates the cache by refetching the analytics data.
 * @return {Promise}
 */
const getAnalytics = () => {
  const currentTime = Date.now()
  if (cache.data && cache.expires > currentTime) {
    return Promise.resolve(cache.data)
  }
  return fs.readFileAsync(config.ANALYTICS_LOG, 'utf-8').then(data => {
    return data ? data.trim().split('\n').map(JSON.parse) : {}
  }).tap(data => {
    cache.data = data
    cache.expires = currentTime + CACHE_EXPIRATION_TIME
  })
}

module.exports = exports = {
  getAnalytics
}
