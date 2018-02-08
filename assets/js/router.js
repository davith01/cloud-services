/** /
CloudSkol.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        // home modules
        .state('home', {
            url: '/home',
            templateUrl: '/views/home'
        })
		.state('user', {
            url: '/home',
            templateUrl: '/views/home'
        })
        //named views
        .state('about', {
            // we'll get to this in a bit
        });
});
/**/
 CloudSkol.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.otherwise({
		redirectTo: '/home',
		templateUrl: '/views/home'
	});
	
	Services.getModules(function(err,modules){
		if(modules){
			var href = null;
			for(var module in modules){
				for(var action in modules[module]){
					href = modules[module][action].href;
					href = href.replace('#!/','/');
					$routeProvider
					.when(href,{
						redirectTo: href,
						templateUrl: '/views/'+module+'/'+action
						//,controller: 'routeCtr'
					});
				}
			}
			
		}
	});
}]);
/**/