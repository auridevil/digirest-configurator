'use strict';
const gulp = require('gulp');


/**
 * scaffold task
 */
gulp.task('crud-scaffold', require('./crud_scaffold')(gulp));


/**
 * digirest init
 */
gulp.task('digi-init', require('./digi_init')(gulp));


/**
 * run watcher
 */
gulp.task('retire:watch', ['retire'], require('./retire_watch').retire_watch(gulp));
/**
 * inner watcher
 */
gulp.task('retire', require('./retire_watch').retire(gulp));


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
  console.log('digi-init');
  console.log('retire:watch');
}