(function() {
    'use strict';

    angular
        .module('todo.services')
        .service('UserModel', UserModel);

    UserModel.$inject = ['$http', 'BackandDataService', 'LoginService'];

    function UserModel($http, BackandDataService, LoginService) {

        var service = this;

        var baseUrl = '/1/objects/',
            objectName = 'users/';

        service.fetch = fetchItem;

        function fetchItem() {
            //   return $http.get(getUrlForId(id));
            return LoginService.getUserDetails().then(function(response) {
                console.log('fetchItem', response);
                var filter = [{
                    "fieldName": "email",
                    "operator": "equals",
                    "value": response.username
                }];
                console.log('filter', filter);
                var url = "https://api.backand.com:443/1/objects/users?pageSize=20&pageNumber=1";
                //&filter=%5B%20%7B%20%20%20%20%22fieldName%22%3A%20%22email%22%2C%20%20%20%20%22operator%22%3A%20%22equals%22%2C%20%20%20%20%22value%22%3A%20%221%401.com%22%20%20%7D%5D"

                return $http({
                    method: 'GET',
                    url: getUrl(),
                    params: {
                        pageSize: 1,
                        pageNumber: 1,
                        filter: filter
                    }
                }).then(function(response){
                    var data = response.data.data;
                    if (data.length === 1) {
                        return data[0];
                    }
                });
            })

        };


        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }
        ////////////////

        function exposedFn() {}
    }
})();