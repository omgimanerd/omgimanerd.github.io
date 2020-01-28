/**
 * @fileoverview Gulpfile for compiling website assets.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */
/* eslint-disable require-jsdoc */

const del = require('del')
const gulp = require('gulp')
const gulpCssnano = require('gulp-cssnano')
const gulpLess = require('gulp-less')

const clean = callback => {
  return del.sync('dist', callback)
}

const less = () => {
  return gulp.src('src/less/*.less')
    .pipe(gulpLess())
    .pipe(gulpCssnano())
    .pipe(gulp.dest('dist'))
}

const watch = () => {
  return gulp.watch('src/**/*', less)
}

module.exports = {
  clean,
  less,
  watch
}
