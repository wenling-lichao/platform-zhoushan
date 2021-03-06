angular.module('app.overrun-group').controller('OverrunGroupItemDetailCtrl',
  function ($scope, $state, $modal, sliderService, $rootScope, $location, anchorSmoothScroll) {

    /*--------------------------
     $ 目录
     --------------------------*/
    /*
     选项卡
     集体讨论
     全屏案卷
     页内导航
     详细信息
     */


    var path = '../apps/overrun-group/partials/';

    /*--------------------------
     $ 选项卡
      必须从 overrun 拷贝更新
     --------------------------*/
    $scope.tabset = [{
      name: '案件',
      content: 'detailContent',
      operator: 'detailOperator'
    }, {
      name: '证件',
      content: 'photoContent',
      operator: 'photoOperator'
    }]

    // 集体讨论待处理无案卷
    if ($state.current.name != "myapp.overrun-group.todo") {
      /*$scope.tabset.push({
        name: '案卷',
        content: 'docContent',
        operator: 'docOperator'
      })*/
      $scope.hideDetailOperator = true;
      $scope.showOperator = true;
    }


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
     $ 集体讨论
     --------------------------*/
    $scope.edit = function () {
      var modalInstance = $modal.open({
        backdrop: "static",
        keyboard: false,
        size: "lg",
        templateUrl: path + 'item-edit.html',
        controller: 'OverrunGroupItemEditCtrl',
        resolve: {
          item: function () {
            return $scope.item
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
        controller: 'OverrunGroupViewerFullscreenCtrl',
        resolve: {
          item: function(){
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
      $scope.cj_zz_label = _getLabel($scope.item.cj_cxlx)
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

    function _getLabel(cxlx) {
      if (cxlx == '超重') {
        return '总重'
      } else if (cxlx == '超长') {
        return '总长'
      } else if (cxlx == '超宽') {
        return '总宽'
      } else if (cxlx == '超高') {
        return '总高'
      } else if (cxlx == '集装箱超高') {
        return '集装箱总高'
      }
    }
  })
