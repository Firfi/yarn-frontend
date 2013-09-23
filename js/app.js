'use strict';


// Declare app level module which depends on filters, and services
angular.module('yarneeApp', ['yarneeApp.filters', 'yarneeApp.services', 'yarneeApp.directives', 'yarneeApp.controllers', 'ngRoute', 'ui.bootstrap'])
    .run(['$rootScope', function($rootScope) {$rootScope.html_title = 'Yarnee'}]) // Set default html title
    .run(['$rootScope', function($rootScope) {$rootScope.warning = window.cookieExists("auth_tkt") ? '' : 'Please login!'; }])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {


        $locationProvider.html5Mode(true).hashPrefix('!');
        
        // See https://yarnee.atlassian.net/wiki/x/qgAI
        
        
        //               /app/yarn/simon/qhbfh9/view
        $routeProvider.when('/yarn/:userid/:yarnid/view*pagenumber',    {templateUrl: 'partials/view_yarn.html',            controller: 'view-yarnCtrl'});
        $routeProvider.when('/yarn/:userid/:yarnid/view/:pagenumber*',  {templateUrl: 'partials/view_yarn.html',            controller: 'view-yarnCtrl'});
        $routeProvider.when('/yarn/:userid/:yarnid/view/',              {templateUrl: 'partials/view_yarn.html',            controller: 'view-yarnCtrl'});
        $routeProvider.when('/yarn/create*newpage',                     {templateUrl: 'partials/create_and_edit_yarn.html', controller: 'create-yarnCtrl'}); // *newpage is only there to avoid errors
        $routeProvider.when('/yarn/create/',                            {templateUrl: 'partials/create_and_edit_yarn.html', controller: 'create-yarnCtrl'}); // *newpage is only there to avoid errors
        $routeProvider.when('/yarn/create/:newpage*',                   {templateUrl: 'partials/create_and_edit_yarn.html', controller: 'create-yarnCtrl'}); // *newpage is only there to avoid errors
        $routeProvider.when('/yarn/:userid/:yarnid/edit',       {templateUrl: 'partials/create_and_edit_yarn.html', controller: 'create-yarnCtrl'});
        $routeProvider.when('/my/yarns',                                {templateUrl: 'partials/my_yarns.html',             controller: 'my-yarnsCtrl'});
        $routeProvider.when('/not_found',                               {templateUrl: 'partials/not_found.html'});
        $routeProvider.when('',                                         {redirectTo:  '/my/yarns'});
        $routeProvider.when('/',                                        {redirectTo:  '/my/yarns'});
        // $routeProvider.otherwise({redirectTo: '/not_found/'});
    }
]);
