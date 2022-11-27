/**
 * @fileoverview This file handles the fetching, caching, and updating of the
 * LaTeX notes.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import child_process from 'child_process';
import fs from 'fs/promises';
import path from 'path';

import config from '../config.js';

/**
 * Invokes the commands in the notes directory to pull and update the notes.
 * @return {Promise}
 */
const updateNotes = () => {
  return child_process.exec('git pull', { cwd: config.NOTES_PATH }).then(() => {
    return child_process.exec('gulp clean', { cwd: config.NOTES_PATH })
  }).then(() => {
    return child_process.exec('gulp latex', { cwd: config.NOTES_PATH })
  })
}

const capitalize = word => {
  return `${word[0].toUpperCase()}${word.substring(1)}`
}

/**
 * Given a LaTeX file directory name, this function separates out the parts by
 * delimiter and formats it into a displayable format.
 * @param {string} directory The class directory name
 * @return {string}
 */
const formatClassName = directory => {
  const parts = directory.split('_')
  const label = `${parts[0].toUpperCase().replace('-', ' ')}: `
  const className = parts[1].split('-').map(capitalize).join(' ')
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
 * /notes page.
 * @return {Promise}
 */
const getNotes = () => {
  // Iterate through each directory in the latex folder.
  return fs.readdir(config.NOTES_PATH).then(directories => {
    // For each directory
    return Promise.all(directories.map(directory => {
      const dirPath = path.join(config.NOTES_PATH, directory)
      // Read the names of all the files in the directory
      return fs.readdir(dirPath).then(files => {
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
    })).then(data => {
      return data.flat().reduce((accumulator, directory) => {
        for (const name in directory) {
          // Must use JSON object setting instead of ES6 .set since
          // pugjs will not interpolate the object correctly.
          accumulator[name] = directory[name]
        }
        return accumulator
      }, new Map())
    })
  })
}

export default {
  updateNotes,
  getNotes
}
