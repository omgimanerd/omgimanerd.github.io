/**
 * @fileoverview This is the file that determines the behavior of the Gulp task
 *   runner.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var gulp = require('gulp');

var async = require('async');
var fs = require('fs');
var path = require('path');

var del = require('del');
var compilerPackage = require('google-closure-compiler');
var cleanCss = require('gulp-clean-css');
var gjslint = require('gulp-gjslint');
var rename = require('gulp-rename');
var scss = require('gulp-scss');
var merge = require('merge-stream');

var JS_DIRECTORY = './public/js';
var OUTPUT_DIRECTORY = './public/dist';

var getClosureCompilerConfiguration = function(outputFile) {
  var closureCompiler = compilerPackage.gulp();
  return closureCompiler({
    externs: [
      compilerPackage.compiler.CONTRIB_PATH + '/externs/jquery-1.9.js',
      path.dirname(__filename) + '/extern/extern.js'
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
  var jsFiles = fs.readdirSync(JS_DIRECTORY).filter(function(file) {
    return fs.statSync(path.join(JS_DIRECTORY, file)).isFile();
  });
  var tasks = jsFiles.map(function(file) {
    return gulp.src(path.join(JS_DIRECTORY, file))
      .pipe(getClosureCompilerConfiguration(
        path.basename(file, '.js') + '.min.js'))
      .pipe(gulp.dest(OUTPUT_DIRECTORY));
  });
  return merge(tasks);
});

gulp.task('scss', function() {
  return gulp.src(['./public/scss/*.scss'])
    .pipe(scss())
    .pipe(cleanCss())
    .pipe(rename('minified.css'))
    .pipe(gulp.dest(OUTPUT_DIRECTORY));
});

gulp.task('clean', function() {
  return del(OUTPUT_DIRECTORY);
});

gulp.task('watch-js', function() {
  gulp.watch(['./public/js/*.js',
              './extern/*.js'], ['js-compile']);
});

gulp.task('watch-scss', function() {
  gulp.watch('./public/scss/*.scss', ['scss']);
});

gulp.task('watch', ['watch-js', 'watch-scss']);
