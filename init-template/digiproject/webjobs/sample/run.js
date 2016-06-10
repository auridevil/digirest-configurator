/**
 * Created by Aureliano on 18/11/2015.
 */

/**
 * run for mail scheduler
 */
var SERVICE_VERSION = '1.0.0';
var HTTPS_PREF = 'https://'
var https = require('https');
var route = '/api/INSERT_ROUTE_TO_INVOKE';
var jwt = require('jsonwebtoken');
var secretConf = require('./SecretConfig');
var host = (process.env.HOST)? process.env.HOST : '127.0.0.1';

console.log( SERVICE_VERSION + ' Invoking ' +  host + route );

var tokenizeME = {
    cd_privilege : 'CMS-ACCESS-ADMIN',
    host: host
}

var token = jwt.sign(tokenizeME,secretConf.secret);
//console.log(secretConf.secret);

var options = {
    'host': host,
    'port': 443,
    'path': route,
    'method' : 'GET',
    'headers': {
        'x-access-token': token
    }
}

//console.log(JSON.stringify(options));

https.get(options,function(res){
//https.get(host + route, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);

    res.on('data', function(d) {
        process.stdout.write(d);
        if(d == 'OK'){
            console.log('Invocation Done!');
        }else if (d && d.success){
            console.log('Invocation Done and success!');
        }
    });

    if(res.statusCode!=200){
        throw new Error (res.statusCode + ' ' + res.header);
    }

}).on('error', function(e) {
    console.error(e);
    // break the execution
    throw e;
});


