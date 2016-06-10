/**
 * Copyright [2015] Quirino Brizi - quirino.brizi@gmail.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by serverlicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var express = require('express'),
  server = express(),
  passport = require('passport'),
  authenticationStrategyFactory = require('./authentication-strategy-factory'),
  bodyParser = require('body-parser'),
  _ = require('underscore'),
  EndpointBuilder = require('./endpoint-builder'),
  path = require('path');;

/**
 * Configure stevedore accordingly to the configuration defined by the user.
 * @param  {object} options The configuration options
 */
module.exports.configure = function(options) {
  return new ServiceConfigurer(options).configure();
};

function ServiceConfigurer(options) {

  if (!options) {
    throw new Error('configuration options must be provided');
  }
  this.options = options;

  this.configure = function() {
    this.configurePassport();
    this.configureExpress();
    this.configureServer();
  };

  this.configurePassport = function() {
    server.use(passport.initialize());
    passport.use(authenticationStrategyFactory.instance(this.options.get('authentication')));
  };

  this.configureExpress = function() {

    server.use("/static", express.static(path.join(__dirname, '../public')));
    server.use(bodyParser.json());

    var lighthouse = require('./lighthouse')(this.options),
      whitelist = this.options.get('authentication.whitelist') || [];

    for (var key in whitelist) {
      var endpoint = whitelist[key];
      // path = /(\/lighthouse\/).*/ig.exec(endpoint.path);
      // if (!path || '/lighthouse/' !== path[1]) {
      //   throw new Error('whitelist path should be on the form /lighthouse/.*');
      // }
      console.log('[service-configurer] whitelisting endpoint [%j]', endpoint);
      new EndpointBuilder()
        .withPath(endpoint.path)
        .withVerb(endpoint.verb)
        .withRouter(lighthouse.docker)
        .build(server);
    }

    new EndpointBuilder()
      .withPath('/lighthouse/api/*')
      .withVerb('all')
      .withRouter(lighthouse.docker)
      .withAuthenticator(passport.authenticate(this.options.get('authentication.type'), {
        session: false
      }))
      .build(server);
  };

  this.configureServer = function() {
    if (this.options.get('server.https')) {
      var https = require('https'),
        fs = require('fs'),
        httpsOptions = this.options.get('server.https_options'),
        serverOptions = _.omit(httpsOptions, 'pfx', 'cert', 'key');
      if ('pfx' in httpsOptions) {
        serverOptions.pfx = fs.readFileSync(httpsOptions.pfx);
      } else {
        serverOptions.cert = fs.readFileSync(httpsOptions.cert);
        serverOptions.key = fs.readFileSync(httpsOptions.key);
      }
      https
        .createServer(serverOptions, server)
        .listen(this.options.get('server.port'));
    } else {
      server.listen(this.options.get('server.port'));
    }
  };
};