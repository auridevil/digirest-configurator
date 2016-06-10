'use strict';
const gulp = require('gulp');


/**
 * scaffold task
 */
gulp.task('crud-scaffold', require('./crud_scaffold')(gulp));

/**
 * defualt task
 */
gulp.task('default', function() {
  help();
});

function help() {
  console.log('Usage: gulp taskname params');
  console.log('task available are:');
  console.log('crud-scaffold');
}