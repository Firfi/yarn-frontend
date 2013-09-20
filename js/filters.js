'use strict';

/* Filters */

angular.module('yarneeApp.filters', []).filter('interpolate',
['version', function(version) {
	return function(text) {
		return String(text).replace(/\%VERSION\%/mg, version);
	}
}]);



//angular.module('MyReverseModule', []).filter('reverse', function() {
//	return function(input, uppercase) {
//		var out = "";
//		for ( var i = 0; i < input.length; i++) {
//			out = input.charAt(i) + out;
//		}
//		// conditional based on optional argument
//		if (uppercase) {
//			out = out.toUpperCase();
//		}
//		return out;
//	}
//});
//
//angular.module('yarneeApp.filters', []).filter('miniyarn', function() {
//	return function(id) {
//		var out = '';
//		
//		out = angular.element('<div>'+id+'</div>');
//		
//		return out;
//	}
//});