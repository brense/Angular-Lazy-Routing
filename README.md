# Angular-Lazy-Routing
A route provider for angular, that features lazy loading of controllers

Usually angular apps or websites need to load all controllers on first page load, even though some of those controllers might never be used by the client, because they simply do not visit the page that uses it.

Lazy Routing makes use of the `resolve` property of the `route` method in the default angular `$routeProvider` to load a controller before the route is resolved.

### How to use

1. Load the Lazy Routing module. The Lazy Routing module depends on the Angular route module and ofcourse Angular
```html
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-route.min.js"></script>
<script src="dist/angular-lazy-routing.min.js"></script>
```
2. Add `ngLazyRouting` as a dependency
```javascript
var myApp = angular.module('myApp', ['ngLazyRouting']);
```
3. Configure the `$routingConfigProvider` in your app config
```javascript
myApp.config(function ($routingConfigProvider) {
    $routingConfigProvider
        .setRouteCallback(function (path, $q, $http) {
            var deferred = $q.defer();
            // handle the route, then resolve
            var route = {
              template: '<p>Hello World!</p>'
              controller: {
                name: 'MyController',
                path: 'path/to/MyController.js'
              }
            }
            deferred.resolve(route);
            return deferred.promise;
        })
});
```
4. Register your controllers to the ngLazyRouting module (since it needs them to be able to find them)
```javascript
angular.module('ngLazyRouting').controller('MyController', function ($scope) {
    // do stuff
});
```
