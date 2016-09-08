angular.module('ngLazyRouting').provider('$routingConfig', function () {
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