angular.module('ngLazyRouting', ['ngRoute']);

angular.module('ngLazyRouting').config(['$provide', '$controllerProvider', '$routeProvider', function ($provide, $controllerProvider, $routeProvider) {
    angular.module('ngLazyRouting').controller = $controllerProvider.register;
    $provide.factory('$routeProvider', function () {
        return $routeProvider;
    });
}]);

angular.module('ngLazyRouting').run(['$routeProvider', '$routingConfig', 'RoutingService', function($routeProvider, routingConfig, RoutingService){
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