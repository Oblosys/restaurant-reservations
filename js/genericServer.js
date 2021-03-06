/**
 * Web server for reservations app
 */

var portNr = process.argv[2] || 8200
  , http     = require('http')
  , url      = require('url')
  , fs       = require('fs')
  , express  = require('express')
  , bodyParser = require('body-parser')
  , _        = require('underscore')
  , Backbone = require('backbone')
  // , db       = require('./db-mysql')
  , db       = require('./db-json')
  , util     = require('oblo-util')
  , app;

function writeError(res, nr, msg) {
  console.error('ERROR '+nr+': '+msg);
  res.writeHead(nr, {'Content-Type': 'text/plain'});
  res.write(msg);
  res.end();
}

// todo: still necessary?
process.on('uncaughtException', function(err) {
  // handle the error safely
  console.log(err);
});



function createApplication() {
  var app = express();

  app.use('/js', express.static(__dirname ));
  app.use('/node_modules', express.static(__dirname + '/../node_modules'));
  app.use(express.static(__dirname + '/../www'));
//  app.use(express.logger());
  app.use(function(req, res, next) { // logger only seems to report in GMT, so we log by hand
    var now = new Date();
    console.log('\nRQ: ' + util.showDate(now) + ' ' + util.showTime(now) + ' (' + req.ip + ', "' + req.headers['user-agent'].slice(0,20) + '..") path:' + req.path);
    next();
  });
  app.use(bodyParser.json()); // for parsing application/json

  app.get('/model/:type/:id', function(req, res) {
    db.readModel(req.params.type, req.params.id, {
      success: function(resp) {res.send(resp);},
      error: function(nr,msg){
        writeError(res, nr, msg);
      }
    });
  });
  app.post('/model/:type', function(req, res) { 
    console.log(req.body);
    db.createModel(req.params.type, req.body, {
      success: function(resp) {res.send(resp);},
      error: function(nr,msg){
        writeError(res, nr, msg);
      }
    });
  });
  app.put('/model/:type/:id', function(req, res) {
    db.updateModel(req.params.type, req.params.id, req.body, {
      success: function(resp) {res.send(resp);},
      error: function(nr,msg){
        writeError(res, nr, msg);
      }
    });
  });
  app.delete('/model/:type/:id', function(req, res) {
    db.deleteModel(req.params.type, req.params.id, {
      success: function(resp) {res.send(resp);},
      error: function(nr,msg){
        writeError(res, nr, msg);
      }
    });
  });
  
  return app;
}

function createServer(app) {
  /*
  app.use(function(err, req, res, next) {
    // here we can handle exceptions, (function not called otherwise)
    // but the default behaviour seems just fine (send to console and as 500 response)
    res.send(500, 'error');
  });
  */

  db.initDb();
  return http.createServer(app);
}

// By providing a listen function, we can listen to the port specified in this module.
function listen(server) {
  server.listen(portNr, function() {
    console.log('Server running at http://127.0.0.1:'+portNr+'/');
  });
}

exports = module.exports = createApplication;
exports.version = '0.1.0';
exports.createServer = createServer;
exports.listen = listen;
exports.db = db;