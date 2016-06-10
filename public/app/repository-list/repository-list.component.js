angular
  .module('repositoryList', [])
  .component('repositoryList', {
    templateUrl: 'app/repository-list/repository-list.template.html',
    controller: [
      '$http',
      function RepositoryListController($http) {
        var self = this;
        $http.get('http://localhost:3000/lighthouse/api/_catalog').then(function(response) {
          self.repositories = response.data.repositories;
        });
      }
    ]
  });