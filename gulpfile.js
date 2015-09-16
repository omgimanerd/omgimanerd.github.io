/**
 * Javascript Task Runner
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('less', function() {
  console.log('Recompiling CSS');
  return gulp.src('./style/styles.less')
    .pipe(less())
    .pipe(gulp.dest('./style'));
});

gulp.task('watch-less', function() {
  gulp.watch('./style/*.less', ['less']);
});
