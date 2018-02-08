var CloudSkol = angular.module('CloudSkol', ['ngRoute']);//['ui.router']);
//var CloudSkol = angular.module('CloudSkol', ['ui.router']);

CloudSkol.controller('index', ['$scope','$window','services',function($scope,$window,services) {
	
	GENTELELLA.start();
	
	var languageBtn = $('#traslateSubmitModal');
	languageBtn.on('click', function(ev) {
		var lang = $("#traslateSelected").val();
		setTraslate(lang);
	});
	
	function setTraslate(lang){
		services.setTraslate(lang,function(err,traslate){
		  $scope.view = traslate;
		   
		});	
	}
	var lang = $window.navigator.language || $window.navigator.userLanguage;
	    lang = lang.split('-') ? lang.split('-')[0] : lang;
	setTraslate(lang);
	
}]);

CloudSkol.run(['$rootScope',function($rootScope) {
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
		if (typeof NProgress != 'undefined') { // NProgress
			NProgress.start();
		}		
	});
	//Others $rootScope listener includeContentLoaded,includeContentRequested
	$rootScope.$on('$locationChangeSuccess', function (event, next, current) {		
		if (typeof NProgress != 'undefined') {// NProgress
			NProgress.done();
		}
	});	
 }]);

$("a#logout").on('click', function(ev) {
	Services.logOut(function(err,response){
		if(response==='success') location = '/login';
		else $indexMessage.show('danger',response.status,response.message);
	})
});