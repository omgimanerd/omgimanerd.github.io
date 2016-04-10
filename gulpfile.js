/**
 * @fileoverview This is the file that determines the behavior of the Gulp task
 *   runner.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var gulp = require('gulp');

var less = require('gulp-less');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var lessAutoprefix = require('less-plugin-autoprefix');
var lessCleancss = require('less-plugin-clean-css');

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

gulp.task('less', function() {
  return gulp.src('./style/*.less')
    .pipe(plumber())
    .pipe(getLessConfiguration())
    .pipe(rename('minified.css'))
    .pipe(gulp.dest('./style'));
});

gulp.task('watch', function() {
  gulp.watch('./style/*.less', ['less']);
});
