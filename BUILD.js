/**
 * This file contains compilation and build rules for the project. This file
 * is imported by the gulpfile during compilation and build.
 */

module.exports = {
  GULPFILE_VERSION: '3.0.0',
  DEFAULT_TASKS: ['js', 'sass'],
  DEFAULT_WATCH: ['watch-js', 'watch-sass'],
  JS_LINT_RULES: [
    {
      name: 'client side javascript',
      sourceFiles: [
        './public/js/**/*.js'
      ]
    },
    {
      name: 'routers',
      sourceFiles: [
        './routers/*.js'
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
      outputFile: './public/dist/layout.min.js'
    },
    {
      name: 'notes.js',
      externs: [
        './node_modules/google-closure-compiler/contrib/externs/jquery-1.9.js',
        './extern/extern.js'
      ],
      compilationLevel: 'ADVANCED_OPTIMIZATIONS',
      sourceFiles: [
        './public/js/notes.js',
      ],
      outputFile: './public/dist/notes.min.js'
    }
  ],
  SASS_BUILD_RULES: [
    {
      name: 'sass stylesheet',
      sourceFiles: [
        './public/sass/styles.scss'
      ],
      outputFile: './public/dist/minified.css'
    }
  ],
  CLEAN_PROJECT_PATHS: [
    './public/dist/*'
  ]
};
