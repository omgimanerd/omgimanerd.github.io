/**
 * This file contains compilation and build rules for the project. This file
 * is imported by the gulpfile during compilation and build.
 * For build system: 1.3.0
 */

module.exports = {
  GULPFILE_VERSION: "1.3.0",
  DEFAULT_TASKS: ['js', 'sass'],
  JS_LINT_RULES: [
    {
      name: 'client side javascript',
      sourceFiles: [
        './public/js/**/*.js'
      ]
    }
  ],
  JS_BUILD_RULES: [
    {
      name: 'layout.js',
      externs: [
        './node_modules/google-closure-compiler/contrib/externs/jquery-1.9.js',
        './extern/extern.js'
      ],
      compilationLevel: 'ADVANCED_OPTIMIZATIONS',
      sourceFiles: [
        './public/js/layout.js',
      ],
      outputDirectory: './public/dist',
      outputFile: 'layout.min.js'
    },
    {
      name: 'index.js',
      externs: [
        './node_modules/google-closure-compiler/contrib/externs/jquery-1.9.js',
        './extern/extern.js'
      ],
      compilationLevel: 'ADVANCED_OPTIMIZATIONS',
      sourceFiles: [
        './public/js/index.js',
      ],
      outputDirectory: './public/dist',
      outputFile: 'index.min.js'
    }
  ],
  SASS_BUILD_RULES: [
    {
      name: 'sass stylesheet',
      sourceFiles: [
        './public/sass/styles.scss'
      ],
      outputDirectory: './public/dist',
      outputFile: 'minified.css'
    }
  ],
  CLEAN_PROJECT_RULES: [
    './public/dist'
  ]
};
