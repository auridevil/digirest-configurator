var spawn = require('child_process').spawn;
var gutil = require('gulp-util');
var retire = require('retire');


exports.retire_watch = function(gulp) {
  return function(done) {
    gulp.watch(['js/**/*.js', 'package.json'], ['retire']);
  };
}


exports.retire = function(gulp) {
  return function() {
    // Spawn Retire.js as a child process
    // You can optionally add option parameters to the second argument (array)
    var child = spawn('retire', [], {
      cwd: process.cwd()
    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function(data) {
      gutil.log(data);
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function(data) {
      gutil.log(gutil.colors.red(data));
      gutil.beep();
    });
  }
}

