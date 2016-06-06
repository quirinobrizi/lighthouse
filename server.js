/**
 * Copyright [2015] Quirino Brizi - quirino.brizi@gmail.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var cluster = require('cluster'),
  os = require('os');
if (cluster.isMaster) {
  /*
   * Fork workers
   */
  for (var i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker %j died, received signal %j and code %j', worker.process.pid, signal, code);
  });
  cluster.on('online', function(worker) {
    console.log('Worker %d forked', worker.process.pid);
  });
} else {
  var config = require('config'),
    configurer = require('./libs/configurer');
  configurer.configure(config);
}

// // set up ========================
// var express  = require('express');
// var app      = express();                               // create our app w/ express
// // var mongoose = require('mongoose');                     // mongoose for mongodb
// var morgan = require('morgan');             // log requests to the console (express4)
// var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
// var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
// // configuration =================
// // mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io
// app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
// app.use(morgan('dev'));                                         // log every request to the console
// app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
// app.use(bodyParser.json());                                     // parse application/json
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
// app.use(methodOverride());
// // listen (start app with node server.js) ======================================
// app.listen(8080);
// console.log("App listening on port 8080");