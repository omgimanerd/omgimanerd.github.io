/**
 * Javascript Task Runner
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var notify = require('gulp-notify');

gulp.task('less', function() {
  return gulp.src('./style/styles.less')
    .pipe(less({ compress: true}))
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(gulp.dest('./style'))
    .pipe(notify('LESS compiled and minified'));
});

gulp.task('watch-less', function() {
  gulp.watch('./style/*.less', ['less']);
});
