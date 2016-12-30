/**
 * Multipurpose Javascript Task Runner to compile my projects.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 * @version 3.0.0
 */

const version = "3.0.0";

var semver = require('semver');

var gulp = require('gulp');
var merge = require('merge-stream');
var path = require('path');

try {
  var BUILD = require('./BUILD');
  if (semver.gt(BUILD.GULPFILE_VERSION, version)) {
    console.warn('Your gulpfile.js is outdated and may not work properly!');
  } else if (semver.gt(version, BUILD.GULPFILE_VERSION)) {
    console.warn('Your BUILD.js is using an older format. Consider updating ' +
        'it as certain features may not work.');
  }
} catch (error) {
  throw new Error('Unable to read BUILD.js');
}

gulp.task('default', BUILD.DEFAULT_TASKS || ['js', 'less', 'sass']);

gulp.task('js', ['js-lint', 'js-compile']);

gulp.task('lint', ['js-lint']);

gulp.task('scss', ['sass']);

/**
 * Example rule:
 * JS_LINT_RULES: [
 *   {
 *     name: 'rule name',
 *     sourceFiles: [
 *       '/path/to/file1',
 *       '/path/to/file2'
 *     ]
 *   }
 * ]
 */
gulp.task('js-lint', function() {
  if (BUILD.JS_LINT_RULES) {
    var gjslint = require('gulp-gjslint');

    return merge(BUILD.JS_LINT_RULES.map(function(rule) {
      // Set default flags to be used for gulp-gjslint
      var flags = [
        '--jslint_error indentation',
        '--jslint_error well_formed_author',
        '--jslint_error braces_around_type',
        '--jslint_error unused_private_members',
        '--jsdoc',
        '--max_line_length 80',
        '--error_trace'
      ] || rule.flags;
      return gulp.src(rule.sourceFiles).pipe(gjslint({
        flags: flags
      })).pipe(gjslint.reporter('console'))
         .on('finish', function() {
           console.log('Finished linting ' + rule.name);
         });
    }));
  } else {
    console.warn('JS_LINT_RULES are not defined in your BUILD.js');
  }
});

/**
 * Example rule:
 * JS_BUILD_RULES: [
 *   {
 *     name: 'rule name',
 *     externs: [
 *       'path/to/externs'
 *     ],
 *     compilationLevel: 'SIMPLE_OPTIMIZATIONS/ADVANCED_OPTIMIZATIONS',
 *     sourceFiles: [
 *       '/path/to/file1',
 *       '/path/to/file2'
 *     ],
 *     outputFile: [
 *       '/path/to/outputFile'
 *     ]
 *   }
 * ]
 */
gulp.task('js-compile', function() {
  if (BUILD.JS_BUILD_RULES) {
    var compilerPackage = require('google-closure-compiler');
    var plumber = require('gulp-plumber');

    var closureCompiler = compilerPackage.gulp();
    var getClosureCompilerConfiguration = function(externs, compilationLevel,
                                                   filename) {
      return closureCompiler({
        externs: externs,
        warning_level: 'VERBOSE',
        compilation_level: compilationLevel,
        js_output_file: filename
      });
    };

    return merge(BUILD.JS_BUILD_RULES.map(function(rule) {
      return gulp.src(rule.sourceFiles)
        .pipe(plumber())
        .pipe(getClosureCompilerConfiguration(rule.externs,
                                              rule.compilationLevel,
                                              path.basename(rule.outputFile)))
        .pipe(gulp.dest(path.dirname(rule.outputFile)))
        .on('end', function() {
          console.log('Finished compiling ' + rule.name + ' with ' +
              rule.compilationLevel);
        });
    }));
  } else {
    console.warn('JS_BUILD_RULES are not defined in your BUILD.js');
  }
});

/**
 * Example rule:
 * LESS_BUILD_RULES: [
 *   {
 *     name: 'rule name',
 *     sourceFiles: [
 *       '/path/to/file1',
 *       '/path/to/file2'
 *     ],
 *     outputFile: [
 *       '/path/to/outputFile'
 *     ]
 *   }
 * ]
 */
gulp.task('less', function() {
  if (BUILD.LESS_BUILD_RULES) {
    var less = require('gulp-less');
    var plumber = require('gulp-plumber');
    var rename = require('gulp-rename');
    var lessPluginAutoprefix = require('less-plugin-autoprefix');
    var lessPluginCleanCss = require('less-plugin-clean-css');

    var getLessConfiguration = function() {
      var autoprefix = new lessPluginAutoprefix({
        browsers: ["last 2 versions"]
      });
      var cleanCss = new lessPluginCleanCss({
        advanced: true
      });
      return less({
        plugins: [autoprefix, cleanCss]
      });
    };

    return merge(BUILD.LESS_BUILD_RULES.map(function(rule) {
      return gulp.src(rule.sourceFiles)
        .pipe(plumber())
        .pipe(getLessConfiguration())
        .pipe(rename(path.basename(rule.outputFile)))
        .pipe(gulp.dest(path.dirname(rule.outputFile)))
        .on('end', function() {
          console.log('Finished compiling ' + rule.name);
        });
    }));
  } else {
    console.warn('LESS_BUILD_RULES are not defined in your BUILD.js');
  }
});

/**
 * Example rule:
 * SASS_BUILD_RULES: [
 *   {
 *     name: 'rule name',
 *     sourceFiles: [
 *       '/path/to/file1',
 *       '/path/to/file2'
 *     ],
 *     outputFile: [
 *       '/path/to/outputFile'
 *     ]
 *   }
 * ]
 */
gulp.task('sass', function() {
  if (BUILD.SASS_BUILD_RULES) {
    var sass = require('gulp-sass');
    var plumber = require('gulp-plumber');
    var rename = require('gulp-rename');

    return merge(BUILD.SASS_BUILD_RULES.map(function(rule) {
      return gulp.src(rule.sourceFiles)
        .pipe(plumber())
        .pipe(sass({
          outputStyle: 'compressed'
        }))
        .pipe(rename(path.basename(rule.outputFile)))
        .pipe(gulp.dest(path.dirname(rule.outputFile)))
        .on('end', function() {
          console.log('Finished compiling ' + rule.name);
        })
    }));
  } else {
    console.warn('SASS_BUILD_RULES are not defined in your BUILD.js');
  }
});

/**
 * Sample rule:
 * CLEAN_PROJECT_PATHS: [
 *   'path/to/dir'
 * ]
 */
gulp.task('clean', function() {
  if (BUILD.CLEAN_PROJECT_PATHS) {
    var del = require('del');
    return del(BUILD.CLEAN_PROJECT_PATHS).then(function(paths) {
      console.log('Cleaned:\n' + paths.join('\n'));
    });
  } else {
    console.warn('CLEAN_PROJECT_RULES are not defined in your BUILD.js');
  }
});

/**
 * Sample rule:
 * JASMINE_TEST_PATHS: [
 *   '/path/to/tests'
 * ]
 */
gulp.task('test', function() {
  if (BUILD.JASMINE_TEST_PATHS) {
    var jasmine = require('gulp-jasmine');
    return gulp.src(BUILD.JASMINE_TEST_PATHS)
      .pipe(jasmine()).on('end', function() {
        console.log('Finished running unit tests');
      });
  } else {
    console.warn('JASMINE_TEST_PATHS are not defined in your BUILD.js');
  }
});

gulp.task('watch-js', function() {
  if (BUILD.JS_BUILD_RULES) {
    BUILD.JS_BUILD_RULES.map(function(rule) {
      gulp.watch(rule.sourceFiles, ['js'])
    });
  } else {
    console.warn('JS_BUILD_RULES are not defined in your BUILD.js');
  }
});

gulp.task('watch-less', function() {
  if (BUILD.LESS_BUILD_RULES) {
    BUILD.LESS_BUILD_RULES.map(function(rule) {
      gulp.watch(rule.sourceFiles, ['less']);
    });
  } else {
    console.warn('LESS_BUILD_RULES are not defined in your BUILD.js');
  }
});

gulp.task('watch-scss', ['watch-sass']);

gulp.task('watch-sass', function() {
  if (BUILD.SASS_BUILD_RULES) {
    BUILD.SASS_BUILD_RULES.map(function(rule) {
      gulp.watch(rule.sourceFiles, ['sass']);
    });
  } else {
    console.warn('SASS_BUILD_RULES are not defined in your BUILD.js');
  }
});

gulp.task('watch',
          BUILD.DEFAULT_WATCH || ['watch-js', 'watch-less', 'watch-sass']);
