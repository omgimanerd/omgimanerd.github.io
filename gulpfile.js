/**
 * @fileoverview Gulpfile for compiling website assets.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */
/* eslint-disable require-jsdoc */

import { deleteAsync } from 'del'
import gulp from 'gulp'
import gulpCssnano from 'gulp-cssnano'
import gulpLess from 'gulp-less'

const clean = () => {
  return deleteAsync('dist')
}

const copyAssets = () => {
  return gulp.src(['src/assets/*', 'src/img/*.png', 'src/js/*.js'])
    .pipe(gulp.dest('dist'))
}

const less = () => {
  return gulp.src('src/less/*.less')
    .pipe(gulpLess())
    .pipe(gulpCssnano())
    .pipe(gulp.dest('dist'))
}

const watch = () => {
  return gulp.watch('src/**/*', gulp.parallel(
    copyAssets, less))
}

export {
  clean,
  copyAssets as copy,
  less,
  watch,
  watch as default,
}