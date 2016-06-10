'use strict';

/** Connection Configurations */
var domain = 'myservice.scm.azurewebsites.net';
var password = '';
var username = '';

var SKIP_DEPLOY = true;


/** WebJobConfigurations */
var jobConfigurations = [
    {name : 'sample', // this is the same name as the folder and as the final zip
       type: 'triggered',
       main: 'run.js'        // file to be executed
    }
    // ,{name : 'mail-send', // this is the same name as the folder and as the final zip
    //    type: 'triggered',
    //    main: 'run.js'        // file to be executed
    // }
];

/** Global vars */
var protocol = 'https://';
var PLACEHOLDER = 'REPLACE';
var route = '/api/' + PLACEHOLDER + 'webjobs/'
var contentDisposition = 'attachement; filename=' + PLACEHOLDER;


/** Requires */
var AdmZip = require('adm-zip');
var fs = require('fs');
var path = require('path');
var request = require('request');
var https = require('https');
var sleep = require('sleep');


/** Create The Zip-s */
var webjobs = getDirectories('.');

console.log('----------------');
console.log('Zip creation:')
console.log('All subdirs: ' + webjobs);



for(var i=0; i<webjobs.length; i++){
    var zip = new AdmZip();
    zip.addLocalFolder('./' + webjobs[i]);
    zip.writeZip(webjobs[i] + '.zip');
    console.log(webjobs[i] + '.zip created');
    sleep.sleep(1);
}

if(!SKIP_DEPLOY) {
    /** Upload the zips */
    console.log('----------------');
    if(jobConfigurations.length>1){
        console.log('WARNING: deploy is not working for more than 1 jobs');
    }
    console.log('Zip upload:');

    for (var i = 0; i < webjobs.length; i++) {

        var request = require('request');
        console.log(webjobs[i] + ' processing');

        var conf = getConfiguration(webjobs[i]);
        if (conf) {
            var finalRoute = route.replace(PLACEHOLDER, conf.type) + webjobs[i];
            var options = {
                uri: protocol + domain + finalRoute,
                host: domain,
                port: 443,
                path: finalRoute,
                headers: {
                    'Content-Type': 'application/zip',
                    'Host': domain,
                    'Content-Disposition': contentDisposition.replace(PLACEHOLDER, conf.main)
                }
            };

            console.log('option :' + JSON.stringify(options))
            var readStream = fs.createReadStream('./' + webjobs[i] + '.zip');

            readStream.on('open', function () {
                readStream.pipe(request
                    .put(options)
                    .auth(username, password, true)
                    .on('response', function (response) {
                        console.log('Server res: ' + response.statusCode);
                        console.log('Server res: ' + JSON.stringify(response));
                    }));
            });
            //sleep.sleep(60);


        } else {
            console.log(webjobs[i] + ' skipped');
        }
    }

    console.log('----------------');
    console.log('Completed, wait for server response to terminate');

}
/**
 * get the configuration for the webjob
 * @param webjobName
 * @returns {{name, type, main}|*}
 */
function getConfiguration(webjobName){
    for(var i = 0; i<jobConfigurations.length; i++){
        if (jobConfigurations[i].name ===  webjobName){
            return jobConfigurations[i];
        }
    }
    console.log(webjobName + ' configuration not found');
}

/**
 * get the subdirs
 * @param srcpath
 * @returns {*}
 */
function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

/**
 * add the directory to the zip
 * @param zip
 * @param folder
 * @returns {*}
 */
function addDirectoryToZip(zip,folder){
    var files = fs.readdirSync(folder);
    console.log(folder + ' files: ' + files);
    for (var j in files){
        var path = folder + '/' + files[j];
        console.log(path);
        if(fs.lstatSync(path).isDirectory()){
            zip = addDirectoryToZip(zip, path);
        }else {
            zip.addLocalFile(path);
        }
    }
    return zip;
}
