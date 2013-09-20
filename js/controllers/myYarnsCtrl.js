'use strict';

angular.module('yarneeApp.controllers').controller('my-yarnsCtrl',  function($scope, $http, $rootScope, $location) {
  $rootScope.html_title = 'My Yarns';

  $http.get(apiUrl('my-yarns-list', {userid: readCookie('userid')}), {headers: {'Accept': 'application/json'}}).success(function(data) { // API
    $scope.yarns = data.yarns;
  });

  // Click on miniyarn
  // TODO this has to be controller independently
  $scope.openyarn = function(userid, yarnid) {
    console.log('openyarn() called with id '+userid+'/'+yarnid);
    console.log(frontendUrl('read-yarn', {userid: userid, yarnid: yarnid}));
    $location.path(frontendUrl('read-yarn', {userid: userid, yarnid: yarnid}));
  }
});
