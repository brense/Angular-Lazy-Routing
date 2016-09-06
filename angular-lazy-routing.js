var ngLazyRouting = angular.module('ngLazyRouting', ['ngRoute']);

ngLazyRouting.config(['$provide', '$controllerProvider', '$routeProvider', function ($provide, $controllerProvider, $routeProvider) {
    ngLazyRouting.register = { controller: $controllerProvider.register };
    $provide.factory('$routeProvider', function () {
        return $routeProvider;
    });
}]);

ngLazyRouting.run(['$routeProvider', '$routingConfig', 'RoutingService', function($routeProvider, routingConfig, RoutingService){
    if (typeof routingConfig.callback === 'undefined') {
        throw(new Error('Please provide a route callback function using setRouteCallback'));
    }
    var routes = ['/', '/:page*'];
    if(typeof routingConfig.routes !== 'undefined'){
        var routes = routingConfig.routes;
    }
    for(var k in routes) {
        $routeProvider.when(routes[k], {
            template: '<div ng-include="templateUrl"></div>',
            resolve: {
                load: RoutingService.route
            }
        });
    }
    $routeProvider.otherwise({redirectTo: '/'});
}]);

ngLazyRouting.provider('$routingConfig', function () {
    this.error = {
        401: {name: 'unauthorized', template: '<div>401 Unauthorized</div>'},
        403: {name: 'forbidden', template: '<div>403 Forbidden</div>'},
        404: {name: 'notfound', template: '<div>404 Not Found</div>'}
    };
    
    this.setRoutes = function(routes){
        this.routes = routes;
        return this;
    };
    
    this.setErrorTemplate = function(errorCode, template){
        this.error[errorCode] = template;
        return this;
    };
    
    this.setRouteCallback = function(callback){
        this.callback = callback;
        return this;
    };
    
    this.$get = function () {
        return this;
    };
});

ngLazyRouting.service('RoutingService', ['$rootScope', '$q', '$templateCache', '$route', '$routingConfig', function ($rootScope, $q, $templateCache, $route, routingConfig) {
    var Self = this;
    var routesCache = {};
    
    this.route = function () {
        var deferred = $q.defer();
        var path = $route.current.originalPath;
        if (typeof $route.current.pathParams.page !== 'undefined') {
            path = $route.current.pathParams.page;
        }
        if (typeof routesCache[path] === 'undefined') {
            var injector = angular.injector(['ng']);
            injector.instantiate(routingConfig.callback, {path: (path.indexOf('/') === 0 ? path : '/' + path)}).then(function (response) {
                routesCache[path] = response;
                $script([response.controller.path], function () {
                    Self.applyRouteChange(path, response);
                    deferred.resolve();
                });
            }).catch(function (e) {
                Self.handleErrors(e);
                deferred.resolve();
            });
        } else {
            Self.applyRouteChange(path, routesCache[path]);
            deferred.resolve();
        }
        return deferred.promise;
    };
    
    this.handleErrors = function (e) {
        $rootScope.$broadcast('routing error', e);
        if (typeof routingConfig.error[e.status] !== 'undefined') {
            var error = routingConfig.error[e.status];
            var templateUrl = error.name;
            if(typeof error.template !== 'undefined'){
                $templateCache.put(templateUrl, error.template);
            } else if(typeof error.templateUrl !== 'undefined'){
                templateUrl = error.templateUrl;
            } 
            $rootScope.templateUrl = templateUrl;
        }
    };
    
    this.applyRouteChange = function(path, route){
        if(typeof route.template !== 'undefined'){
            $templateCache.put(path, route.template);
            $rootScope.templateUrl = path;
        } else if(typeof route.templateUrl !== 'undefined'){
            $rootScope.templateUrl = route.templateUrl;
        }
        $route.current.controller = route.controller.name;
    };
}]);