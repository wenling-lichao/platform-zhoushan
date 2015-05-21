angular.module('app.login', [
  'ngAnimate',
  'cfp.hotkeys'
])
  .controller('LoginCtrl', function ($scope, $http) {
    var parentScope = parent.angular.element('#clientIndex').scope();

    $scope.test = function(){
      $scope.isError = !$scope.isError;
    }


    $scope.wkno = 'test';
    $scope.passwd = '123';

    $scope.login = function () {
      $http.post('/api/logins/login.do', {wkno: $scope.wkno, passwd: $scope.passwd})
        .success(function (res) {
          //console.log('res', res);
          if (res.success) {
            parentScope.signIn();
          }else{

          }
        })
    }
  })