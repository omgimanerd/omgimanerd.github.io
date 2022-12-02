/**
 * @fileoverview Gulpfile for compiling website assets.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */
/* eslint-disable require-jsdoc */

import del from 'del'
import gulp from 'gulp'
import gulpCssnano from 'gulp-cssnano'
import gulpLess from 'gulp-less'

const clean = callback => {
  return del.sync('dist', callback)
}

const copyImg = () => {
  return gulp.src('src/img/*.png')
    .pipe(gulp.dest('dist'))
}

const copyJs = () => {
  return gulp.src('src/js/*.js')
    .pipe(gulp.dest('dist'))
}

const copyPng = () => {
  return gulp.src('src/*.pdf')
    .pipe(gulp.dest('dist'))
}

const less = () => {
  return gulp.src('src/less/*.less')
    .pipe(gulpLess())
    .pipe(gulpCssnano())
    .pipe(gulp.dest('dist'))
}

const watch = () => {
  return gulp.watch('src/**/*', gulp.parallel(copyImg, copyJs, copyPng, less))
}

export {
  clean,
  copyImg as img,
  copyJs as js,
  copyPng as png,
  less,
  watch,
  watch as default,
}