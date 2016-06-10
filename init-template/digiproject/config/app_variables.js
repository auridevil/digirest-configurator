/*
 * use this file to register variables on app ONLY.
 * @Author: Aureliano
 */
function _registerVars(app){
    app.set('test variable','vars successfully loaded on app');
    // here you can insert any variable on app, to get as app.get('key')
    app.set('title','DigiREST Toolkit');
    app.set('env','development');
    app.set('logger-level','dev');




    // do not modify over here
    console.log('registered locals on app');
}
// export the method, should be invocated on app
exports.registerVars=_registerVars;