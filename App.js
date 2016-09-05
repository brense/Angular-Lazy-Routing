app.config(function ($routingConfigProvider) {
    $routingConfigProvider
        .setRouteCallback(function (path, $q, $http) {
            var deferred = $q.defer();
            $http({method: 'GET', url: 'pages.php?page=' + path}).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (e) {
                return deferred.reject(e);
            });
            return deferred.promise;
        })
        .setErrorTemplate(404, '404.html');
});