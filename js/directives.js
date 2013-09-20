'use strict';

/* Directives */


var module = angular.module('yarneeApp.directives', []);
//
//
////activity items can be of several types .. post-photo, status-change, etc. (think facebook activity stream)
//module.directive('media', ['$compile', '$http', '$templateCache', function($compile, $http, $templateCache) {
//	console.log('media called');
//
//	var templateText, templateLoader,
//    baseURL = 'partial/partials/media/',
//    typeTemplateMapping = {
//      image:    'image.html',
//      img:    	'image.html',
//      youtube:	'youtube.html'
//    };
//  return {
//    restrict: 'A',
//    replace: true,
//    transclude: true,
//    scope: {
//      type: '@type', title: '=', authorName: '=', avatar: '=', timeAgo: '=', statsLikes: '=', statsViews: '=' // some basic stats for your post
//    },
//    
//    compile: function(tElement, tAttrs) {
//    	console.log('compile() called');
//    	
//    	console.log(tAttrs.type);
//    	
//    	var tplURL = baseURL + typeTemplateMapping[tAttrs.type];
//      
//      templateLoader = $http.get(tplURL, {cache: $templateCache})
//        .success(function(html) {
//          tElement.html(html);
//        });
//
//      return function (scope, element, attrs) {
//        templateLoader.then(function (templateText) {
//          element.html($compile(tElement.html())(scope));
//        });
//      };
//      
//    }
//  };
//}])
//
//
////// Great example for different tempaltes according to media type: https://coderwall.com/p/mgtrkg
////// Dynamic template generation, see https://github.com/angular/angular.js/commit/eb53423a41136fcda0c5e711f2d104952080354b
////module.directive('media', function () {
////	var obj = {
////			restrict: 'A',
////			// priority: 0,
//////			templateUrl: function($element, $attrs) {
//////				// console.log($element);
//////				// console.log($attrs.ressource);
//////				// console.log($attrs);
//////				return 'my-directive.html';
//////            }, 
////			template: '<div>TEMPLATE</div>',
////			replace: false,
////			transclude: false,
////			scope: false, // "false" means, the global scope is used
////			// controller: function controllerConstructor($scope, $element, $attrs, $transclude) {console.log('"controller:" called');},
////			// require: '',
////			link: function (scope, iElement, iAttrs) {
////				console.log('"link:" called');
////				
////				scope.$watch('iAttrs', function(oldVal, newVal) {
////					
////					console.log(iElement);
////					
////				    if(newVal) {
////				    	console.log('Something changed!');
////				    }
////				 });
////			},
////			scope: {
////			      showApp: '@',
////			      media: '&'
////			    },
////			compile: function compile(tElement, tAttrs, transclude) {
////				console.log('"compile:" called');
////				
////				return tElement;
////				
//////				return {
//////					pre: function preLink(scope, iElement, iAttrs, controller) {  },
//////					post: function preLink(scope, iElement, iAttrs, controller) {},
//////				}
////				// return {};
////			},
////			
////			
////	};
////	return obj;
////});
//
//
//////override the default input to update on blur
////angular.module('yarneeApp.directives', []).directive('ngBlur', function() {
////    return {
////        restrict: 'A',
////        require: 'ngModel',
////        link: function(scope, elm, attr, ngModelCtrl, event) {
////            if (attr.type === 'radio' || attr.type === 'checkbox') return;
////            
////            // required?
////            // elm.unbind('input').unbind('keydown').unbind('change');
////            
////            elm.bind('blur', function() {
////            	// TODO see http://stackoverflow.com/a/912631/22470 , since broadcast does not work
////            	var method = attr.ngBlur;
////            	eval('scope.'+method);
////            });
////            
//////            elm.bind('keypress', function(event) {
//////            	if(event.which == 13) {
//////            		elm.trigger('blur');
//////            	}
//////            });
////        }
////    };
////});
//
//
//// See http://www.grobmeier.de/angular-js-autocomplete-and-enabling-a-form-with-watch-and-blur-19112012.html?language=de#.UbWhPpz4Iek
////directives.directive('blur', function () {
////    return function (scope, elem, attrs) {
////        elem.bind('blur', function () {
////            scope.$apply(attrs.blur);
////        });
////    };
////});

