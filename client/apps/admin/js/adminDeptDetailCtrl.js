angular.module('app.admin').controller('AdminDeptDetailCtrl',
  function ($scope, $state, $modal, sliderService, $rootScope ) {

    $scope.select = function (tab) {
      $scope.selected = tab;
    }

    // 案件修改
    var path = '../apps/admin/partials/';
    $scope.edit = function () {
      var modalInstance = $modal.open({
        backdrop: "static",
        keyboard: false,
        size: "lg",
        templateUrl: path + 'dept-edit.html',
        controller: 'AdminDeptEditCtrl',
        resolve: {
          item: function () {
            return $scope.item // 指令内部控制器，不能访问到外部 scope
          },
          itemIsNew: function(){return false;}
        }
      })

      modalInstance.result.then(function () {
        sliderService.startAutoHide();
      }, function () {
        sliderService.startAutoHide();
      });

      modalInstance.opened.then(function () {
        sliderService.stopAutoHide();
      })
    }




    $scope.isSelected = function (tab) {
      return (tab === $scope.selected) ? 'active' : '';
    }


    // 接收详细信息
    $rootScope.$on("entity.update", function (event, res) {
      $scope.item = res.data;
    })

  })
