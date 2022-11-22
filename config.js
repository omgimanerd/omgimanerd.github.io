/**
 * @fileoverview This file contains global constants needed on the server. It
 * performs necessary checks to assure the validity of the environment
 * configuration.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import url from 'url';

const CONST_AVAILABLE =
  fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK;

const PORT = process.env.PORT || 5000;

dotenv.config();

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const NOTES_PATH = path.join(dirname, 'rit', 'latex');
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

fs.access(NOTES_PATH, CONST_AVAILABLE, error => {
  if (error) {
    throw new Error('Unable to access /notes, please clone the notes repo.');
  }
});

export default {
  PORT,
  NOTES_PATH,
  GITHUB_WEBHOOK_SECRET
};
