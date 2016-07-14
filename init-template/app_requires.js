/**
 * This file manage all the app.js require
 * Author: Aureliano
 */

exports.express = require('express');
exports.path = require('path');
exports.favicon = require('serve-favicon');
exports.requestlogger = require('morgan');
exports.compression = require('compression');
exports.errorhandler = require('errorhandler');
exports.async = require('async');
exports.cookieParser = require('cookie-parser');
exports.bodyParser = require('body-parser');
exports.varMgr = require('./config/app_variables');
exports.toobusy =  require('toobusy-js');
exports.analytics = require('nodalytics')
exports.headerBreaker = require ('./src/digirest-src/middleware/NotModifiedBreakerMiddleware');
exports.cors = require('cors');
var digirest = require('./src/digirest');
var ObjectFactory = digirest.getObjectFactory();
exports.digirest=digirest;
exports.ObjectFactory=ObjectFactory;
exports.logger = ObjectFactory.logger;

exports.basicauth =  function (req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    };
    var user = require('basic-auth')(req);
    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    };
    if (user.name === 'admin' && user.pass === 'admin') {
        return next();
    } else {
        return unauthorized(res);
    };
};
