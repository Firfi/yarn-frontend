'use strict';

angular.module('yarneeApp.controllers').controller('view-yarnCtrl',  function($scope, $routeParams, $http, $rootScope, $timeout) {
  var page_on_screen  = parseInt(($routeParams.pagenumber || '0').replace(/[^0-9]+/g, '')); // match ex. "/view/2" in the URL.

  console.log($routeParams);

  $http.get(apiUrl('get-yarn', {userid: $routeParams.userid, yarnid: $routeParams.yarnid}), {headers: {'Accept': 'application/json'}}).success(function(data) { // API
    $scope.yarn             = data;
    $rootScope.html_title   = 'Read Yarn "'+$scope.yarn.pages[0].meta.title+'"';
    $scope.show_page(); // or something similar to $scope.$apply();
  });

  $scope.init_current_page = function() {
    if (!(!isNaN(parseFloat(page_on_screen)) && isFinite(page_on_screen))) {
      page_on_screen = 0; // 0 = cover page!
    }
  };

  $scope.next = function() {
    console.info('next() called');

    if (page_on_screen < $scope.yarn.pages.length) {
      page_on_screen = page_on_screen + 1;
    } else {
      console.info('Last page reached!');
      return;
    }

    $scope.show_page();
  };



  $scope.prev = function() {
    console.info('prev() called');

    if (page_on_screen > 0) {
      page_on_screen = page_on_screen - 1;
    } else {
      console.info('First page reached!');
      return;
    }

    $scope.show_page();
  };




  $scope.follow = function() {
    console.info('follow() called');
    $http({
      method: 'POST',
      url:    apiUrl('user-follow', {userid: $scope.yarn.meta.userid}),
    });
  };



  $scope.favorite = function() {
    console.info('favorite() called');
    $http({
      method: 'POST',
      url:    apiUrl('yarn-favorite', {userid: $scope.yarn.meta.userid, yarnid: $scope.yarn.meta.yarnid}),
    });
  };



  $scope.show_page = function() {
    $scope.init_current_page();
    console.log('Showing page '+page_on_screen);

    var page_number = page_on_screen - 1; // digital counting, starting with 0!

    if (page_number < 0) {
      page_number = 0;
    }
    var page    = $scope.yarn.pages[page_number];


    $scope.imageexists              = angular.isString(page.content[0].meta.type) && page.content[0].meta.type.length > 0;
    if ($scope.imageexists) {
      $scope.templateIdentifier   = './partials/media/'+page.content[0].meta.type+'.html';
    }

    $scope.page = page;
  }
});