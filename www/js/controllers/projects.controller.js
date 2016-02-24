(function () {
  'use strict';

  angular
    .module('todo')
    .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = ['ProjectService', '$ionicModal', '$state', '$scope', '$ionicListDelegate'];
  function ProjectsController(ProjectService, $ionicModal, $state, $scope, $ionicListDelegate) {

    var vm = this;
    vm.saveNewProject = saveNewProject;
    vm.deleteProject = deleteProject;
    vm.showProjectModal = showProjectModal;
    vm.closeProjectModal = closeProjectModal;
    vm.getMoreProjects = getMoreProjects;
    vm.doRefresh = doRefresh;
    vm.pageNumber = 1;
    vm.pageSize = 10;
    vm.moreDataCanBeLoaded = true;
    vm.projects = [];
    activate();

    ////////////////

    function activate() {
      ProjectService.getProjects(vm.pageNumber, vm.pageSize).then(function (result) {
        vm.projects = result;
      }
        , function errorCallback(response) {
          console.log(response);
        });

      $ionicModal.fromTemplateUrl(
        'templates/modal-new-project.html',
        function (modal) {
          vm.projectModal = modal;
        },
        {
          scope: $scope
        }
        );
    }

   function getMoreProjects() {
      vm.pageNumber = vm.pageNumber + 1;
      console.log('getMoreProjects', vm.pageNumber);
      ProjectService.getProjects(vm.pageNumber, vm.pageSize)
        .then(function (result) {
          console.log('got more result', result);
          
          var rowNum = result.length ;
          if (rowNum === 0 || rowNum < vm.pageSize) {
            vm.moreDataCanBeLoaded = false;
          }

          if (rowNum > 0) {
            vm.projects = vm.projects.concat(result);
          }
        })
        .finally(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete')
        });
    }

    function doRefresh() {
      vm.refreshing = true;
      console.log('doRefresh');
      ProjectService.getProjects(1, vm.pageNumber * vm.pageSize)
        .then(function (result) {
          console.log('doRefresh result', result);
          vm.projects = result;
        })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
          vm.refreshing = false;
        });
    }
    function saveNewProject(project) {
      console.log(project);
      var projectName = project.name;
      if (projectName) {
        ProjectService.addProject(project.name).then(function (result) {
          console.log('project', result);

          vm.projects.push(result);

          vm.closeProjectModal();
          project.name = '';

          $state.go('tab.tasks', { projectId: result.data.id, projectName: result.data.name }, { location: true });
        },
          function errorCallback(response) {
            console.log(response);
          });
      }
    }

    function deleteProject(project) {
      console.log('deleteProject', project, vm.projects);
      ProjectService.deleteProject(project).then(function (result) {
        console.log('deleting row from vm.task', vm.projects.indexOf(project));
        vm.projects.splice(vm.projects.indexOf(project), 1);
      },
        function (error) {
          console.log('error deleting project', error);
          $ionicListDelegate.closeOptionButtons();
        });
    }

    function showProjectModal() {
      vm.projectModal.show();
    }

    function closeProjectModal() {
      vm.projectModal.hide();
    }

    $scope.$on('$destroy', function () {
      vm.projectModal.remove();
    });
  }
})();