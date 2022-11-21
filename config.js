/**
 * @fileoverview This file contains global constants needed on the server. It
 * performs necessary checks to assure the validity of the environment
 * configuration.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

/**
 * Parses a dictionary of settings and their corresponding value from the
 * config file in the project root directory. Uses the equal sign as a
 * delimeter.
 * @param {String} filepath The path to the config file.
 * @return {Map}
 */
const parseEnvFile = filepath => {
  /* eslint-disable no-sync */
  const data = readFileSync(filepath, { encoding: 'utf-8' })
  /* eslint-enable no-sync */
  const env = new Map()
  for (const line of data.split('\n')) {
    const pieces = line.split('=')
    if (pieces.length !== 2) {
      throw Error(`Unable to parse env file at ${filepath}`)
    }
    console.log(`Loaded config value: ${pieces[0]} = ${pieces[1]}`)
    env.set(pieces[0], pieces[1])
  }
  return env
}

const env = parseEnvFile(join(__dirname, '.env'))

const GITHUB_WEBHOOK_SECRET = env.get('GITHUB_WEBHOOK_SECRET')
const NOTES_PATH = join(__dirname, env.get('NOTES_PATH'))
const PRODUCTION = process.argv.includes('--prod')

/* eslint-disable no-sync */
if (!existsSync(NOTES_PATH)) {
  throw new Error('Unable to find RIT notes directory')
}
/* eslint-enable no-sync */

export default exports = {
  NOTES_PATH,
  GITHUB_WEBHOOK_SECRET,
  PRODUCTION
}
