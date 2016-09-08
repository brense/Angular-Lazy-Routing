# Angular-Lazy-Routing
A route provider for angular, that features lazy loading of controllers

Usually angular apps or websites need to load all controllers on first page load, even though some of those controllers might never be used by the client, because they simply do not visit the page that uses it.

Lazy Routing makes use of the `resolve` property of the `route` method in the default angular `$routeProvider` to load a controller before the route is resolved.

## How to use

Load the Lazy Routing module. The Lazy Routing module depends on the Angular route module and ofcourse Angular
```html
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-route.min.js"></script>
<script src="dist/angular-lazy-routing.min.js"></script>
```
Add `ngLazyRouting` as a dependency
```javascript
var myApp = angular.module('myApp', ['ngLazyRouting']);
```

Configure the `$routingConfigProvider` in your app config
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
Register your controllers to the ngLazyRouting module (since it needs them to be able to find them)
```javascript
angular.module('ngLazyRouting').controller('MyController', function ($scope) {
    // do stuff
});
```

## $routingConfigProvider methods
### setRouteCallback(callback `function`)
This callback function will be called during routing. The callback function must return a promise. When the promise is resolved, the `$routeChangeSuccess` event will be fired (see angular docs on [$routeProvider](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider)). The promise must be resolved with the following object:
```javascript
{
    template: 'string', // optional, An html string to be loaded into the view. Template takes precedence over templateUrl
    templateUrl: 'string', // optional, The path of the template to be loaded into the view
    controller: { // required
        name: 'string', // required, The actual name of the controller
        path: 'string' // required, The path where the controller can be found
    }
}
```

### setRoutes(routes `array`)
This function can be used to change the default routes, the default routes are `['/', '/:page*']`.

### setErrorTemplate(erroCode `int`, template `obj`)
This function can be used to overwrite the default error templates when a route cannot be resolved, for example when you want to show a 404 template when a route cannot be found. The `template` object is as follows:
```javascript
{
    name: 'string', // required, The name for the error template (used for caching)
    template: 'string', // optional, An html string to be loaded into the view. Template takes precedence over templateUrl
    templateUrl: 'string' // optional, The path of the template to be loaded into the view
}
```
