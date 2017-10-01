/**
 * @fileoverview This file handles the fetching and caching of analytics data.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const _ = require('lodash')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const moment = require('moment')

const config = require('../config')

const CACHE_EXPIRATION_TIME = 1000 * 60 * 10

// Local cache
const cache = {}

/**
 * Iterates through a date range day by day.
 * @param {Date|number} min The start date.
 * @param {Date|number} max The max date.
 * @param {Function} callback The callback to run on each date.
 */
const iterByDay = (min, max, callback) => {
  for (const day = moment(min); day.isBefore(max); day.add(1, 'day')) {
    callback(day)
  }
}

/**
 * Given an analytics data series, returns the min and max date.
 * @param {Object} data The analytics data series.
 * @return {Object}
 */
const getDateRange = data => {
  return data.length < 2 ? null : {
    min: moment(data[0].timestamp).startOf('day'),
    max: moment(data[data.length - 1].timestamp).endOf('day')
  }
}

/**
 * Returns the rounded minimum element in a list.
 * @param {Array<number>} l The list to evaluate.
 * @return {number}
 */
const min = l => {
  return !l ? 0 : Math.round(Math.min(...l))
}

/**
 * Returns the rounded average element in a list.
 * @param {Array<number>} l The list to evaluate.
 * @return {number}
 */
const avg = l => {
  return !l ? 0 : Math.round(l.reduce((a, b) => a + b) / l.length)
}

/**
 * Returns the rounded maximum element in a list.
 * @param {Array<number>} l The list to evaluate.
 * @return {number}
 */
const max = l => {
  return !l ? 0 : Math.round(Math.max(...l))
}

/**
 * Returns the parsed traffic data from the analytics data series.
 * @param {Array<Object>} series The analytics data series.
 * @return {Object}
 */
const getTrafficData = series => {
  const hitsPerDay = new Map()
  series.forEach(entry => {
    const day = moment(entry.timestamp).startOf('day').toString()
    hitsPerDay.set(day, (hitsPerDay.get(day) || 0) + 1)
  })
  const dateColumn = ['date']
  const hitsPerDayColumn = ['total requests']
  const range = getDateRange(series)
  iterByDay(range.min, range.max, day => {
    dateColumn.push(day.format('YYYY-MM-DD'))
    hitsPerDayColumn.push(hitsPerDay.get(day.toString()) || 0)
  })
  return [dateColumn, hitsPerDayColumn]
}

/**
 * Returns the parsed response time data from the analytics data series.
 * @param {Array<Object>} data The analytics data series.
 * @return {Object}
 */
const getResponseTimeData = data => {
  const timesByDay = {}
  data.forEach(entry => {
    const day = moment(entry.timestamp).startOf('day').toString()
    if (timesByDay[day]) {
      timesByDay[day].push(entry.responseTime || 0)
    } else {
      timesByDay[day] = [entry.responseTime || 0]
    }
  })
  const dateColumn = ['date']
  const minColumn = ['min']
  const avgColumn = ['avg']
  const maxColumn = ['max']
  const range = getDateRange(data)
  iterByDay(range.min, range.max, day => {
    dateColumn.push(day.format('YYYY-MM-DD'))
    minColumn.push(min(timesByDay[day]))
    avgColumn.push(avg(timesByDay[day]))
    maxColumn.push(max(timesByDay[day]))
  })
  return [dateColumn, maxColumn, avgColumn, minColumn]
}

/**
 * Returns the parsed section frequency data from the analytics data series.
 * @param {Array<Object>} data The analytics data series.
 * @return {Object}
 */
const getSectionFrequencyData = data => {
  const frequencies = new Map()
  data.forEach(entry => {
    const url = (entry.req.url || '').split('/')[3]
    frequencies.set(url, (frequencies.get(url) || 0) + 1)
  })
  const sortedSlice = new Map(
    [...frequencies.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
  )
  return [
    ['sections', ...sortedSlice.keys()],
    ['frequency', ...sortedSlice.values()]
  ]
}

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
    if (!data) {
      return {}
    }
    const result = {}
    const series = data.trim().split('\n').map(JSON.parse)
    result.traffic = getTrafficData(series)
    result.responseTimes = getResponseTimeData(series)
    result.frequencies = getSectionFrequencyData(series)
    return result
  }).tap(data => {
    cache.data = data
    cache.expires = currentTime + CACHE_EXPIRATION_TIME
  })
}

module.exports = exports = {
  getAnalytics
}
