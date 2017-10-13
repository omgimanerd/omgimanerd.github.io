/**
 * @fileoverview This file handles the fetching, caching, and updating of the
 * LaTeX notes.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const _ = require('lodash')
const Promise = require('bluebird')
const exec = Promise.promisify(require('child_process').exec)
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')

const config = require('../config')

// Local cache
const cache = {}

/**
 * Invokes the commands in the notes directory to pull and update the notes.
 * @return {Promise}
 */
const updateNotes = () => {
  return exec('git pull', { cwd: config.NOTES_PATH }).then(() => {
    return exec('gulp clean', { cwd: config.NOTES_PATH })
  }).then(() => {
    cache.expired = true
    return exec('gulp latex', { cwd: config.NOTES_PATH })
  })
}

/**
 * Given a latex file directory name, this function separates out the parts by
 * delimiter and formats it into a displayable format.
 * @param {string} directory The class directory name
 * @return {string}
 */
const formatClassName = directory => {
  const parts = directory.split('_')
  const label = `${parts[0].toUpperCase().replace('-', ' ')}: `
  const className = parts[1].split('-').map(_.capitalize).join(' ')
  return label + className
}

/**
 * Given the class directory and the tex file name, this function returns
 * the path to file relative to the root.
 * @param {string} directory The class directory name
 * @param {string} file The tex file name
 * @return {string}
 */
const formatFilePath = (directory, file) => {
  return path.join(
    'notes/latex', directory, 'output', file.replace('.tex', '.pdf'))
}

/**
 * This function returns the hierarchy of notes needed for rendering the
 * /notes page. If the hierarchy has been cached, then this function returns
 * the data stored in the cache, otherwise it updates the cache by traversing
 * through the notes directory.
 * @return {Promise}
 */
const getNotes = () => {
  /**
   * We first check if the notes hierarchy has been previously requested and
   * cached. The cache is considered expired if updateNotes() was invoked, in
   * which case we should update the cache with the new notes hierarchy.
   */
  if (cache.data && !cache.expired) {
    return Promise.resolve(cache.data)
  }
  // Iterate through each directory in the latex folder.
  return fs.readdirAsync(config.NOTES_PATH).then(directories => {
    // For each directory
    return Promise.all(directories.map(directory => {
      const dirPath = path.join(config.NOTES_PATH, directory)
      // Read the names of all the files in the directory
      return fs.readdirAsync(dirPath).then(files => {
        /**
         * Filter out all the .tex files and infer the names of all the
         * .pdf files. Return an object which the template will use to
         * render the expandable accordion.
         */
        return files.filter(file => file.endsWith('.tex')).map(file => {
          return {
            filename: file.replace('.tex', '.pdf'),
            path: formatFilePath(directory, file)
          }
        })
      }).then(data => {
        return { [formatClassName(directory)]: data }
      })
    })).reduce(_.merge)
  }).tap(data => {
    cache.data = data
  })
}

module.exports = exports = {
  updateNotes,
  getNotes
}
