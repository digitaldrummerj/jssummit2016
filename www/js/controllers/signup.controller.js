(function () {
  'use strict';

  angular
    .module('todo')
    .controller('SignUpController', SignUpController);

  SignUpController.$inject = ['Backand', '$state', '$rootScope', 'LoginService'];
  function SignUpController(Backand, $state, $rootScope, LoginService) {
    var vm = this;
    vm.signup = signup;
    vm.email = '';
    vm.password = '';
    vm.again = '';
    vm.firstName = '';
    vm.lastName = '';
    vm.errorMessage = '';

    activate();

    ////////////////

    function activate() { }

    function signup() {
      console.log('signUp', vm.firstName, vm.lastName, vm.email, vm.password, vm.again);
      vm.errorMessage = '';

      LoginService.signup(vm.firstName, vm.lastName, vm.email, vm.password, vm.again)
        .then(function (response) {
          // success
          onLogin();
        }, function (reason) {
          if (reason.data.error_description !== undefined) {
            vm.errorMessage = reason.data.error_description;
          }
          else {
            vm.errorMessage = reason.data;
          }
        });
    }


    function onLogin() {
      $rootScope.$broadcast('authorized');
      $state.go('tab.projects');
    }

  }
})();