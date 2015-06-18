angular.module('app.overrun-admin').controller('OverrunAdminItemDetailCtrl',
  function ($scope, $state, $modal, sliderService, $rootScope, $location, anchorSmoothScroll) {

    /*--------------------------
     $ 目录
     --------------------------*/
    /*
     选项卡
     案件修改（待处理）
     全屏案卷
     页内导航
     详细信息
     */

    /*--------------------------
     $ 选项卡
     --------------------------*/
    $scope.tabset = [{
      name: '案件',
      content: 'detailContent',
      operator: 'detailOperator'
    }, {
      name: '证件',
      content: 'photoContent',
      operator: 'photoOperator'
    }, {
      name: '案卷',
      content: 'docContent',
      operator: 'docOperator'
    }]


    $rootScope.$on("slider.hide.done", function () {
      // 每次都重置为第一个选项卡，因为只有 slider 只加载了第一个
      resetTabActive();
    })

    function resetTabActive() {
      _.each($scope.tabset, function (tab) {
        tab.active = false;
      });
      $scope.tabset[0].active = true;
    }

    // 默认会激活（active=true）第一个选项卡，并且调用 select 方法
    $scope.select = function (tab) {
      $scope.selected = tab;
    }

    /*--------------------------
     $ 案件修改（待处理）
     --------------------------*/
    var path = '../apps/overrun/partials/';
    $scope.edit = function () {
      var modalInstance = $modal.open({
        backdrop: "static",
        keyboard: false,
        size: "lg",
        templateUrl: path + 'item-edit.html',
        controller: 'OverrunItemEditCtrl',
        resolve: {
          item: function () {
            return $scope.item // 指令内部控制器，不能访问到外部 scope
          },
          itemIsNew: function () {
            return false
          }
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

    /*--------------------------
     $ 全屏案卷
     --------------------------*/
    var fullscreenModalInstance;
    $scope.fullscreenDoc = function () {
      fullscreenModalInstance = $modal.open({
        keyboard: true,
        size: "fullscreen",
        templateUrl: path + 'docFullscreen.html',
        controller: 'OverrunViewerFullscreenCtrl',
        resolve: {
          item: function () {
            return $scope.item;
          }
        }
      })
      fullscreenModalInstance.result.then(function () {
        sliderService.startAutoHide();
      }, function () {
        sliderService.startAutoHide();
      });

      fullscreenModalInstance.opened.then(function () {
        sliderService.stopAutoHide();
      })
    }
    // modalInstance.close 依赖 modalInstance.result 和 modalInstance.opened
    $scope.closeModal = function () {
      fullscreenModalInstance.close()
    }


    /*--------------------------
     $ 页内导航
     --------------------------*/
    $scope.gotoAnchor = function (id) {
      $location.hash(id);
      anchorSmoothScroll.scrollTo(id);
    }


    /*--------------------------
     $ 详细信息
     --------------------------*/
    $rootScope.$on("entity.update", function (event, res) {
      $scope.item = res.data;
      // 设置单位
      $scope.unit = _getUnit($scope.item.cj_cxlx)
    })


    function _getUnit(cxlx) {
      if (!cxlx || cxlx == "") {
        return ""
      }
      if (cxlx == '超重') {
        return '吨'
      } else {
        return '米'
      }
    }

  })
