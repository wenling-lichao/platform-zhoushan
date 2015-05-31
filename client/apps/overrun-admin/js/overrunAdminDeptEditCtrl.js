angular.module('app.overrun-admin').controller('OverrunAdminDeptEditCtrl',
  function ($scope, $state, sliderService, $modalInstance,
            requestService, item, itemIsNew, ngToast, $q) {

    // 挂在 $scope
    $scope.item = item;

    // 更新案号年份
    $scope.ahnf = new Date().getFullYear();

    $scope.save = function () {
      var savePromise;
      if (itemIsNew) {
        savePromise = requestService.overrunAdminDeptItemSave($scope.item)
      } else {
        savePromise = requestService.overrunAdminDeptItemUpdate($scope.item)
      }
      $q.all(savePromise).then(function (res) {
        if (res.success) {
          ngToast.create({
            className: 'success',
            content: '保存成功!'
          })
          $modalInstance.close();
        } else {
          ngToast.create({
            className: 'danger',
            content: '保存失败!'
          });
        }
      })
    }


    $scope.closeModal = function () {
      $modalInstance.close();
    }
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    }


  })