'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('yarneeApp.services', []).
  value('version', '0.1');


// TODO all communication with the backend should go trough a service