/**
 * Javascript Task Runner
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var closureCompiler = require('gulp-closure-compiler');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var notify = require('gulp-notify');
var rename = require('gulp-rename');

gulp.task('default', ['js', 'less']);

gulp.task('js', function() {
  return gulp.src('./scripts/*.js')
    .pipe(closureCompiler({
      compilerPath: 'bower_components/closure-compiler/compiler.jar',
      fileName: 'minified.js'
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(notify('JS compiled and minified'));
});

gulp.task('less', function() {
  return gulp.src('./style/styles.less')
    .pipe(less({ compress: true}))
    .pipe(autoprefixer({ browsers: ['last 10 versions']}))
    .pipe(minifyCss())
    .pipe(rename(function(path) {
      path.basename = 'minified';
      path.extname = '.css';
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(notify('LESS compiled and minified'));
});

gulp.task('watch-js', function() {
  gulp.watch('./scripts/*.js', ['js']);
});

gulp.task('watch-less', function() {
  gulp.watch('./style/*.less', ['less']);
});

gulp.task('watch', function() {
  gulp.watch('./scripts/*.js', ['js']);
  gulp.watch('./style/*.less', ['less']);
});
