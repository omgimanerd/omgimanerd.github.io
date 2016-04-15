/**
 * @fileoverview This is the file that determines the behavior of the Gulp task
 *   runner.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var gulp = require('gulp');

var jshint = require('gulp-jshint');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var lessAutoprefix = require('less-plugin-autoprefix');
var lessCleancss = require('less-plugin-clean-css');
var merge = require('merge-stream');

var getLessConfiguration = function() {
  var autoprefix = new lessAutoprefix({
    browsers: ["last 2 versions"]
  });
  var cleancss = new lessCleancss({
    advanced: true
  });
  return less({
    plugins: [autoprefix, cleancss]
  });
};

gulp.task('default', ['js-compile', 'less']);

gulp.task('js', ['js-hint', 'js-compile']);

gulp.task('js-hint', function() {
  return gulp.src(['./public/js/**/*.js'])
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

gulp.task('js-compile', function() {
  return gulp.src(['./public/js/**/*.js'])
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename('minified.js'))
    .pipe(gulp.dest('./public/dist'));
});

gulp.task('less', function() {
  return gulp.src('./public/less/*.less')
    .pipe(plumber())
    .pipe(getLessConfiguration())
    .pipe(rename('minified.css'))
    .pipe(gulp.dest('./public/dist'));
});

gulp.task('watch-js', function() {
  gulp.watch(['./public/js/**/*.js'], ['js-compile']);
});

gulp.task('watch-less', function() {
  gulp.watch('./public/less/*.less', ['less']);
});

gulp.task('watch', function() {
  gulp.watch(['./public/js/**/*.js'], ['js-compile']);
  gulp.watch('./public/less/*.less', ['less']);
});
