const path = require('path');
const yargs = require('yargs').argv;
const rename = require('gulp-rename');
const git = require('gulp-git');
const template = require('gulp-template');
const async = require('async');
const plur = require('plur');

const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
const SNAKE_CASE_REGEXP = /[A-Z]/g;

module.exports = function(gulp) {

  return function() {

    // get params
    var name = yargs.name;
    var parentPath = yargs.parent || '';
    var verboselevel = yargs.verbose || 'none';

    // check params
    if (!name || !parentPath) {
      return help();
    }

    // create names
    var names = {
      upcamelcaseName: name,
      snakecaseName: snake_case(name),
      camelCaseName: camelCase(snake_case(name)),
      lowerName: lower(name),
      capitalName: capital(name),
      plursnakeName: plur(snake_case(name), 2),
      plurupcamelcaseName: plur(name)
    };
    var templatesPath = path.join(__dirname, 'init-template/**/*');
    var destPath = path.join(__dirname, parentPath, name);
    var gitInitPath = parentPath + '/' + names.snakecaseName;

    var task = gulp.src(templatesPath)
      .pipe(template({
        upcamelcaseName: names.upcamelcaseName,
        snakecaseName: names.snakecaseName,
        camelCaseName: names.camelCaseName,
        lowerName: names.lowerName,
        capitalName: names.capitalName,
        plursnakeName: names.plursnakeName,
        plurupcamelcaseName: names.plurupcamelcaseName
      }))
      .pipe(rename(function(dirPath) {
        dirPath.basename = dirPath.basename.split('temp').join(names.plursnakeName);
        dirPath.dirname = dirPath.dirname.split('temp').join(names.plursnakeName);
        printlog('RENAMED: ' + JSON.stringify(dirPath), verboselevel);
      }))
      .pipe(
        gulp.dest(destPath));

    console.log('At the end git init the project root, git init the src root and fetch remote for the digirest')

    return task;

  };
}


/**
 * print a little help
 */
function help() {
  console.log('Usage: gulp digi-init --name projectname --parent outputPath');
  console.log('add --verbose debug for verbose version');
}

/**
 * print a log
 * @param message
 * @param verboselevel
 */
function printlog(message, verboselevel) {
  if (verboselevel == 'debug') {
    console.log(message);
  }
}

/**
 * Converts camelCase to snake_case.
 */
function snake_case(name, separator) {
  separator = separator || '_';
  return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
    return (pos ? separator : '') + letter.toLowerCase();
  });
}

/**
 * Converts snake_case to camelCase.
 * Also there is special case for Moz prefix starting with upper case letter.
 * @param name Name to normalize
 */
function camelCase(name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  }).replace(MOZ_HACK_REGEXP, 'Moz$1');
}

/**
 * capitalize the input
 * @param val
 * @returns {string}
 */
function capital(val) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

/**
 * return lower case
 * @param val
 * @returns {string}
 */
function lower(val) {
  return val.toLowerCase();
}

