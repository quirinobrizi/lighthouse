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
angular
  .module('core.repository')
  .factory('Repository', ['$resource',
    function($resource) {
      return $resource('', {}, {
        catalog: {
          method: 'GET',
          url: 'api/_catalog',
          transformResponse: function(data, headers) {
            return angular.fromJson(data).repositories;
          },
          isArray: true,
          headers: {
            'Authorization': 'Basic bGlnaHRob3VzZTpsaWdodGhvdXNl'
          }
        },
        tags: {
          method: 'GET',
          url: 'api/:repositoryName/tags/list',
          headers: {
            'Authorization': 'Basic bGlnaHRob3VzZTpsaWdodGhvdXNl'
          }
        },
        manifest: {
          method: 'GET',
          url: 'api/:repositoryName/manifests/:tag',
          headers: {
            'Authorization': 'Basic bGlnaHRob3VzZTpsaWdodGhvdXNl'
          }
        }
      });
    }
  ]);