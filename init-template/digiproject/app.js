//various init & vars
global.__base = __dirname + '/';
var MODULE_NAME = 'App.js';

console.log('loading APP');

// hook the require manager
var requireManager = require('./app_requires');
console.log('APP requires ');

var router = requireManager.express.Router();
var httpServer;
// register express app
var app = requireManager.express();

// var register
requireManager.varMgr.registerVars(app);


app.use(requireManager.requestlogger(app.get('logger-level')));
app.use(requireManager.bodyParser.json());
app.use(requireManager.bodyParser.urlencoded({ extended: true }));
app.use(requireManager.errorhandler());
//app.use(requireManager.analytics(process.env.G_MONITOR_ID));
app.use(requireManager.headerBreaker());

// middleware which blocks requests when we're too busy
requireManager.toobusy.maxLag(15000);
app.use(function(req, res, next) {
  if (requireManager.toobusy()) {
    res.send(503, "I'm busy right now, sorry.");
  } else {
    next();
  }
});

// CORS
// app.use(cors());

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  requireManager.logger.info(MODULE_NAME + ': starting up in DEV enviroment');
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

 //production error handler
 //no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.get("/", function(req, res) {
  res.send('Digirest Services Online!' );
});


/** function init */
function _initDigirest(server) {
  requireManager.digirest.registerRoute('GET','/');
  requireManager.digirest.init(app, router, server,'./config/properties/');
  // require('./pu-library-src/services/ErrorService').startup({},MODULE_NAME);
}

/** complete express setup*/
//module.exports = app;
exports.initDigirest = _initDigirest;
exports.express = app;


