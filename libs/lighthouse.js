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

var request = require('request'),
  _ = require('underscore');

module.exports = function(options) {

  console.log('create lighthouse proxy with options: [%j]', options);
  var _options = options;

  function prepareRequestOptions(req) {
    var options = {
      method: req.method,
      url: buildUrl(req)
    };

    if (_.contains(['post', 'put'], req.method.toLowerCase())) {
      options.json = req.body;
    }

    if (Object.keys(req.query).length > 0) {
      options.qs = req.query
    }

    return options;
  }

  function buildUrl(req) {
    return _options.get("registry.url") + '/v2/' + req.path.substring(16);
  }

  function setResponseHeaders(clientResponse, containerResponse) {
    clientResponse.set(_.pick(containerResponse.headers, function(value, key) {
      return !_.contains(['connection'], key);
    }));
  }

  return {
    docker: function(req, resp) {
      var opts = prepareRequestOptions(req);
      request(opts, function(error, response, body) {
        if (error) {
          console.log('unable send request to docker', error);
          resp.send(error).end();
        }
        setResponseHeaders(resp, response);
        resp.status(response.statusCode).send(body).end();
      });
    },

    static: function(req, resp) {

    }
  }
};