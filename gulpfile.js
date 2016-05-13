/**
 * @fileoverview This is the file that determines the behavior of the Gulp task
 *   runner.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var gulp = require('gulp');

var compilerPackage = require('google-closure-compiler');
var cleanCss = require('gulp-clean-css');
var gjslint = require('gulp-gjslint');
var rename = require('gulp-rename');
var scss = require('gulp-scss');
var path = require('path');

var getClosureCompilerConfiguration = function(outputFile) {
  var basePath = path.dirname(__filename);
  var closureCompiler = compilerPackage.gulp();

  return closureCompiler({
    externs: [
      compilerPackage.compiler.CONTRIB_PATH + '/externs/jquery-1.9.js',
      basePath + '/extern/extern.js'
    ],
    warning_level: 'VERBOSE',
    compilation_level: 'ADVANCED_OPTIMIZATIONS',
    js_output_file: outputFile
  });
};

gulp.task('default', ['js-lint', 'js-compile', 'scss']);

gulp.task('js', ['js-lint', 'js-compile']);

gulp.task('lint', ['js-lint']);

gulp.task('js-lint', function() {
  return gulp.src(['./public/js/*.js'])
    .pipe(gjslint({
      flags: ['--jslint_error indentation',
              '--jslint_error well_formed_author',
              '--jslint_error braces_around_type',
              '--jslint_error unused_private_members',
              '--jsdoc',
              '--max_line_length 80',
              '--error_trace'
             ]
    }))
    .pipe(gjslint.reporter('console'));
});

gulp.task('js-compile', function() {
  return gulp.src(['./public/js/*.js'])
    .pipe(getClosureCompilerConfiguration('minified.js'))
    .pipe(gulp.dest('./public/dist'));
});

gulp.task('scss', function() {
  return gulp.src(['./public/scss/*.scss'])
    .pipe(scss())
    .pipe(cleanCss())
    .pipe(rename('minified.css'))
    .pipe(gulp.dest('./public/dist'));
});

gulp.task('watch-js', function() {
  gulp.watch(['./public/js/*.js',
              './shared/*.js',
              './extern/*.js'], ['js-compile']);
});

gulp.task('watch-scss', function() {
  gulp.watch('./public/scss/*.scss', ['scss']);
});

gulp.task('watch', ['watch-js', 'watch-scss']);
