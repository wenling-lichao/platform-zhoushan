angular.module('app.non-overrun').controller('NonOverrunViewerFullscreenCtrl',
  function ($scope, $modalInstance, item) {


    $scope.closeFullscreenModal = function () {
      $modalInstance.close();
    }

    $scope.getPdfurl = function () {
      // pdfurl = fileUpLoad/xxx/xxx/xxx.pdf
      return item.currentpath_pdf;
      //return location.protocol + '//' + location.host + '/' + item.currentpath_pdf;
    }

    $scope.getItem = function () {
      return item;
    }


  })

