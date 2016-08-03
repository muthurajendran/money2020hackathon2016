/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var nodemon = require('gulp-nodemon');

var localConfig = {};
try {
  localConfig = require('./server/config/local.env');
} catch(e) {}

// create a default task and just log a message
gulp.task('default', ['watch','nodemon']);

gulp.task('jshint', function() {
  return gulp.src('app/v1/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jscs())
    .pipe(jscs.reporter('text'));
});

// start express app and watch files
gulp.task('nodemon', function(cb) {

  var started = false;

  return nodemon({
    script: 'app.js',
    env: localConfig
  }).on('start', function() {
    if(!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('watch', function() {
  gulp.watch('app/v1/**/*.js', ['jshint']);
});