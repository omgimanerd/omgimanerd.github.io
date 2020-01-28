/**
 * @fileoverview Gulpfile for compiling website assets.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const del = require('del')
const gulp = require('gulp')
const cssnano = require('gulp-cssnano')
const less = require('gulp-less')

exports.clean = callback => {
  return del.sync('dist', callback)
}

exports.less = () => {
  return gulp.src('src/less/*.less')
    .pipe(less())
    .pipe(cssnano())
    .pipe(gulp.dest('dist'))
}

exports.watch = () => {
  return gulp.watch('src/**/*', ['less'])
}

exports.default = exports.less
